import Plan from "../models/plan.js"

export const createPlan = async(req,res)=>{
    const { name, pricing } = req.body;

    try {
        let plan = await Plan.findOne({ name });
        if (plan) {
            return res.status(400).json({ message: "Plan name already exists" });
        }

        plan = new Plan({
            name,
            pricing,
        });

        await plan.save();
        res.status(201).json(plan);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const getPlans = async (req,res)=>{
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
