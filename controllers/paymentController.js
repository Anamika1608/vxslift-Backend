import razorpayInstance from "../config/razorpay.js";
import crypto from 'crypto'
import Payment from "../models/payment.js";
import User from "../models/user.js";
import Plan from "../models/plan.js";
const RazorpayInstance = razorpayInstance()

export const createOrder = async (req, res) => {
    console.log(req.body)
    const { courseId, price } = req.body;
    const options = {
        amount: price * 100,
        receipt: `receipt_order_1`,
        currency: "INR"
    };
    console.log(options)
    try {
        RazorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "something went wrong !"
                })
            }
            return res.status(200).json(order);
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const verifyPayment = async (req, res) => {
    console.log('Verify payment API called');

    try {
        const { order_id, payment_id, signature, user_ID, packageName } = req.body;
        const secret = process.env.RAZORPAY_SECRET;

        if (!secret) {
            throw new Error('RAZORPAY_SECRET is not set in environment variables');
        }

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === signature) {
            const session = await mongoose.startSession();  // Start a session for transaction
            session.startTransaction();  // Initiate transaction
            try {
                // Save payment details
                const newPayment = new Payment({
                    order_id, 
                    payment_id, 
                    signature, 
                    purchased_by: user_ID 
                });

                await newPayment.save({ session });

                console.log("Payment details saved successfully");

                const purchasedPlan = await Plan.findOne({ name: packageName }).session(session);
                if (!purchasedPlan) {
                    throw new Error("Plan not found");
                }

                // Update user's purchased plans
                const updatedUser = await User.findByIdAndUpdate(
                    user_ID,
                    { $push: { purchased_plan: purchasedPlan._id } },
                    { new: true, session }
                );

                if (!updatedUser) {
                    throw new Error('User not found');
                }

                console.log('Updated User:', updatedUser);

                await session.commitTransaction();  // Commit transaction
                session.endSession();

                return res.status(200).json({
                    success: true,
                    message: "Payment verified and details saved successfully"
                });
            } catch (error) {
                await session.abortTransaction();  // Rollback transaction
                session.endSession();
                console.error("Error saving payment or updating user:", error);

                return res.status(500).json({
                    success: false,
                    message: "Error saving payment details or updating user. Please try again.",
                    error: error.message
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error('Error in payment verification:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during payment verification",
            error: error.message
        });
    }
};

