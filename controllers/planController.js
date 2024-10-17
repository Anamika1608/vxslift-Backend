import Plan from "../models/plan.js"
import User from "../models/user.js";
export const createPlan = async (req, res) => {
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

export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const checkPurchasedPlan = async (req, res) => {
    try {
        const { plan_id, user_id } = req.body;

        if (!plan_id || !user_id) {
            return res.status(400).json({ message: "Plan ID and User ID are required" });
        }
        const user = await User.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hasPurchased = user.purchased_plan.includes(plan_id);

        if (hasPurchased) {
            return res.status(200).json({ message: "User has purchased this plan", purchased: true });
        } else {
            return res.status(200).json({ message: "User has not purchased this plan", purchased: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getPurchasedPlan = async (req, res) => {
    try {
      console.log(req.body);
      const { userID } = req.body;
  
      if (!userID) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await User.findById(userID).populate("purchased_plan");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!user.purchased_plan || user.purchased_plan.length === 0) {
        return res.status(200).json({ message: "No purchased plans found" });
      }
  
      console.log(user.purchased_plan);

      return res.status(200).json(user.purchased_plan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving plan details" });
    }
};
  

