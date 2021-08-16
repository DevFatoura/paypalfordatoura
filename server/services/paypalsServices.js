const axios = require('axios');
const { errorMonitor } = require('events');
const { promises } = require('stream');
const livePaypalApi = 'https://api-m.paypal.com/'
const sandboxPaypapApi = 'https://api-m.sandbox.paypal.com/'
import moment from 'moment';
 
exports.createProduct = async product =>{
    return new Promise(async (resolve, reject) => {
        try{
            const data = { name: product };
             return axios.post(`${sandboxPaypapApi}v1/catalogs/products`, data, {
                auth: {
                  username: 'Af98b05uUOOz0ysY9uJDhrixWNTD32sThdwAST0NcflCu396eV0Fjgd-pnkBbL8DYWYLZcyusXUkocgd',
                  password: 'EN04q3KShv1JSuzZoWRs3eLodpzmKEletKcj3xGs_Ls6BROD98b3YQM8Z8q9ph01Tdn5GnlWIcwbGGtj',
                },
              }).then(result=>{
                return resolve (result.data);
              })
        }catch(error){
          console.log(error)
            return reject (error);
    
        }
    })

    
}

exports.createplan = async req =>{

  return new Promise(async (resolve, reject) => {
        try{
            var data = {
                product_id: req.productId,
                name: req.name,
                description: req.description,
                status: "ACTIVE",
                billing_cycles: [
                  {
                    frequency: {
                      interval_unit: "Year",
                      interval_count: 1
                    },
                    tenure_type: "Regular",
                    sequence: 1,
                    total_cycles: 0,
                    pricing_scheme: {
                      fixed_price: {
                        value: req.price,
                        currency_code: "USD"
                      }
                  }                
                    
                } 
                ],
                payment_preferences:{
                  auto_bill_outstanding: true,
                  setup_fee: {
                    "value": "50",
                    "currency_code": "USD"
                  },
                }               
              
            };
            return axios.post(`${sandboxPaypapApi}v1/billing/plans`, data, {
                auth: {
                  username: 'Af98b05uUOOz0ysY9uJDhrixWNTD32sThdwAST0NcflCu396eV0Fjgd-pnkBbL8DYWYLZcyusXUkocgd',
                  password: 'EN04q3KShv1JSuzZoWRs3eLodpzmKEletKcj3xGs_Ls6BROD98b3YQM8Z8q9ph01Tdn5GnlWIcwbGGtj',
                },
              }).then(result=>{
                return resolve (result.data);
              })
        }catch(error){
    
        }
    })
} 


exports.createSubscription = async req => {
  return new Promise(async (resolve, reject) => {
    try{
      const date = moment().add(1, 'm').format();
      let data = {
        plan_id: req.planId,
        start_time: req.expiryDate || date,      
        application_context: {
          brand_name: "Fatoura.work",
          locale: "en-US",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
          },
          return_url: `http://127.0.0.1:4200/auth/paypal-callback?id=${req.id}`,
          cancel_url: "http://127.0.0.1:4200/pages/subscriptions"
        }
      };
      data = JSON.stringify(data);
      const config = {
        method: 'post',
        url: 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions',
        headers: { 
          'Authorization': 'Basic QWY5OGIwNXVVT096MHlzWTl1SkRocml4V05URDMyc1RoZHdBU1QwTmNmbEN1Mzk2ZVYwRmpnZC1wbmtCYkw4RFlXWUxaY3l1c1hVa29jZ2Q6RU4wNHEzS1NodjFKU3V6Wm9XUnMzZUxvZHB6bUtFbGV0S2NqM3hHc19MczZCUk9EOThiM1lRTThaOHE5cGgwMVRkbjVHbmxXSWN3YkdHdGo=', 
          'Content-Type': 'application/json',
        },
        data : data
      };
      
      return axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return resolve(response.data);
      })
      .catch((error) => {
        console.log(error);
        return reject(error)
      });
    }catch(error){
      return reject (error)
    }
  })

  
}

exports.checkStatus = async req => {
  try{
    return axios.get(`${sandboxPaypapApi}v1/billing/subscriptions/${req.subId}`, {
      auth: {
        username: 'Af98b05uUOOz0ysY9uJDhrixWNTD32sThdwAST0NcflCu396eV0Fjgd-pnkBbL8DYWYLZcyusXUkocgd',
        password: 'EN04q3KShv1JSuzZoWRs3eLodpzmKEletKcj3xGs_Ls6BROD98b3YQM8Z8q9ph01Tdn5GnlWIcwbGGtj',
      },
    }).then(result=>{
      return (result.data);
    })
  }catch(error){

  }
}

exports.cancelSubscription = async req => {
  const config = {
    method: 'post',
    url: `${sandboxPaypapApi}v1/billing/subscriptions/${req.subId}/cancel`,
    headers: { 
      'Authorization': 'Basic QWY5OGIwNXVVT096MHlzWTl1SkRocml4V05URDMyc1RoZHdBU1QwTmNmbEN1Mzk2ZVYwRmpnZC1wbmtCYkw4RFlXWUxaY3l1c1hVa29jZ2Q6RU4wNHEzS1NodjFKU3V6Wm9XUnMzZUxvZHB6bUtFbGV0S2NqM3hHc19MczZCUk9EOThiM1lRTThaOHE5cGgwMVRkbjVHbmxXSWN3YkdHdGo=', 
      'Content-Type': 'application/json'
    },
    data : {}
  };
  return axios(config)
  .then(result => ({success: true}))
}

