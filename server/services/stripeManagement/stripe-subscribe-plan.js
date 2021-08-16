require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);

exports.createSubscription = async(data) =>{
    return new Promise(async (resolve, reject) => {
        try {
          return await stripe.subscriptions
            .create({
              customer: data.customerId,
              items: [
                {
                  price: data.planDetails.priceId
                },
              ],
            })
            .then(async (sub) => {
              data.subId = sub.id;
              data.periodStart = sub.current_period_start;
              data.periodEnd = sub.current_period_end;
              data.invoiceId = sub.latest_invoice
              return resolve(data);
            });
        } catch (err) {
          return reject(err);
        }
    });
}