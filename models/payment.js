import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  payment_id: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  purchased_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment 