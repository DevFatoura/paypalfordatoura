require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);


exports.cancelSubscriptions = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const deleted = await stripe.subscriptions.del(data);
        return resolve(deleted);
      } catch (err) {
        return resolve(err);
      }
    });
  };