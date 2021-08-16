require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
exports.createPlan = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
          const plan = await stripe.plans.create({
            amount: data.planPrice * 100,
            currency: "USD",
            interval: "year",
            interval_count:data.stripeDuration,
            product: data.productId,
          });
          // console.log(plan)
          data.stripePlanId = plan.id;
          return resolve(data);
        } catch (err) {
          return reject(err);
        }
      });
};