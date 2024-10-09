import razorpayInstance from "../config/razorpay.js";
import crypto from 'crypto'
import Payment from "../models/payment.js";

const RazorpayInstance = razorpayInstance()

export const createOrder = async (req, res) => {
    const { courseId, price } = req.body;
    // do not take amount from req.bosy directly take the course id and then fetch the amount from the db 
    const options = {
        amount: price * 100,
        receipt: `receipt_order_1`,
        currency: "INR"
    };

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
        const { order_id, payment_id, signature, user_ID } = req.body;
        const secret = process.env.RAZORPAY_SECRET;

        if (!secret) {
            throw new Error('RAZORPAY_SECRET is not set in environment variables');
        }

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(order_id + "|" + payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === signature) {
            // const newPayment = new Payment({ order_id, payment_id, signature, purchased_by: user_ID })

            // await newPayment.save() // saving to db

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
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