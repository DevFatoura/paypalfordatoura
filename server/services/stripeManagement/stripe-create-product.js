require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
import createPlan  from "./stripe-create-plan";


exports.createProduct = async product => {
    return new Promise(async (resolve, reject) => {
        try{
            return await stripe.products.create({
                name: product.planName,
                // type: product.type,
                description: product.description,
                
              }).then(async (resp) => {
                await stripe.prices
                  .create({
                    unit_amount: product.planPrice * 100,
                    currency: "USD",
                    recurring: { interval: "year", },
                    product: resp.id,
                  }).then(async (res) => {
                    product.productId = resp.id;
                    product.priceId = res.id;
                    const result = await createPlan.createPlan(product);
                    
                    return resolve(result);
                  })
              })
        }catch(error){
            console.log(error)
            return reject (error)
        } 
    })
  
}



