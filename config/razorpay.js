import Razorpay from "razorpay";

const razorpayInstance = ()=>{
    return new Razorpay({
        key_id : process.env.RAZORPAY_API_KEY,
        key_secret : process.env.RAZORPAY_SECRET
    })
}

export default razorpayInstance