import { instance } from "../utils/server.js";

export const checkout = async (req, res) => {

    const options = {
        amount: Number(req.body.price*100),
        // amount: 2000,
        currency: "INR"
    };

    try {
        const order = await instance.orders.create(options) ;
        console.log(order);
        res.status(201).json({message : 'success' , order : order})
    } catch (error) {
        console.log(error);
    }
}

export const paymentVerification = ()=>{
try {
    console.log(req.body);
} catch (error) {
    console.log(error);
    res.status(200).json({message : 'Payment verification failed'} ) 
}
}