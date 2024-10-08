import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    pricing: {
        type: Number,
        required: true,
    }
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
