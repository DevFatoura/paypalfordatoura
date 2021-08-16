require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
import createSubscription from "./stripe-subscribe-plan";


exports.createCustomer = async data => {
    return new Promise(async (resolve, reject) => {
      try {
        await stripe.customers
        .create({
            source: data.cardDetails.cardToken,
            email: data.personalDetails.email,
            name: data.fullName,
        })
        .then(async (res) => {
          data.customerId = res.id;
          const result = await createSubscription.createSubscription(data);
            return resolve(result);
          });
          // return resolve(result);
        
      } catch (err) {
        console.log(err);
        return reject(err);
      }

    });

}

exports.getInvoice = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const invoices = await stripe.invoices.retrieve(
        data.invoiceId
      );
      console.log("invoice",invoices)
      return resolve(invoices);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};