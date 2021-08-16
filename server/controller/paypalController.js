import mongoose from 'mongoose';
import invoices from '../models/invoiceModel';
import users from '../models/userModel';
import template from '../services/mailer/mailtamplates';

const https = require('https');
const axios = require('axios');
const qs = require('qs');
const ObjectId = mongoose.Types.ObjectId;
const invoiceModel = mongoose.model('Invoice');
const userModel = mongoose.model('Users');
const moment = require("moment");
const livePaypalApi = 'https://api-m.paypal.com/'
const sandboxPaypapApi = 'https://api-m.sandbox.paypal.com/'

class paypalController {
  async createConnection(req) {
    try {
      const data = qs.stringify({
        grant_type: 'client_credentials',
      });

      // let username = req.body.username;
      // let password = req.body.password;

      const response = await axios.post(`${livePaypalApi}v1/oauth2/token`, data, {
        auth: {
          username: req.body.clientId,
          password: req.body.secretCode,
        },
      });
      if (response.data) {
        return userModel.findOne({ _id: req.userId }).then(async (resp) => {
          if (resp) {
            resp.clientId = req.body.clientId;
            resp.secretCode = req.body.secretCode;
            resp.paypalEmail = req.body.email;
            resp.paypalConnected = true;
            const result = await resp.save();
            if (result) {
              return {
                status: 200,
                success: true,
                message: 'connected to paypal successfully',
              };
            }
          } else {
            return {
              status: 400,
              success: false,
              message: 'user not found',
            };
          }
        });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async disconnectedPaypal(req) {
    try {
      const user = await userModel.findOne({ _id: req.userId });
      if (user) {
        user.clientId = '';
        user.secretCode = '';
        user.paypalEmail = '';
        user.paypalConnected = false;
        return user.save()
          .then((resp) => {
            return {
              status: 200,
              success: true,
              message: 'paypal disconnected successfully',
            };
          })
          .catch((error) => error);
      }
    } catch (error) {
      return error;
    }
  }

  async createPaypalDraftInvoice(req) {
    try {
      const { data } = req.body;
      const userData = await userModel.findOne({ _id: req.userId });
      return axios.post(`${livePaypalApi}v2/invoicing/invoices`, data, {
        auth: {
          username: userData.clientId,
          password: userData.secretCode,
        },
      }).then(async (resp) => {
        if (resp.data) {
          const invoiceLInk = resp?.data?.href;
          const urlArray = invoiceLInk.split('/');
          const result = await this.sendInvoice(userData, urlArray[urlArray.length - 1], req.body.invoiceId);
          if (result) {
            return result;
          }
          return {
            status: 400,
            success: true,
            message: 'something went wrong',
          };
        }
      })
        .catch((error) => {
          console.log(error);
          return error;
        });
    } catch (error) {
      return error;
    }
  }

  async sendInvoice(userData, paypalInvoiceId, invoiceId) {
    try {
      const data = { send_to_recipient: false };
      const response = await axios.post(`${livePaypalApi}v2/invoicing/invoices/${paypalInvoiceId}/send`, data, {
        auth: {
          username: userData.clientId,
          password: userData.secretCode,
        },
      })
      

      if (response.data) {
        return  invoiceModel.findOne({ _id: invoiceId }).then(async(invoiceData)=>{
          if(invoiceData.paymentHistory && invoiceData.paymentHistory.length){
            let paidAmount = invoiceData.totalAmount - invoiceData.dueAmount ;
            if(invoiceData.currencyValue){
                paidAmount = (paidAmount / invoiceData.currencyValue).toFixed(6)
            }
            return this.recordPayment(paidAmount,invoiceData,paypalInvoiceId).then(async(resp) => {
              invoiceData.paypalInvoiceId = paypalInvoiceId;
              invoiceData.paymentLink = response.data.href;
              return invoiceData.save().then((resp) => ({
                status: 200,
                success: true,
                data: resp.paymentLink,
                message: 'Payment Link generated successfully',
              }));
  
            // console.log('record', resp)
            // return resp;
            })
            .catch((error) => {
              console.log("error record", error)
              return error;
            })
          }else{
            invoiceData.paypalInvoiceId = paypalInvoiceId;
            invoiceData.paymentLink = response.data.href;
            return invoiceData.save().then((resp) => ({
              status: 200,
              success: true,
              data: resp.paymentLink,
              message: 'Payment Link generated successfully',
            }));
          }
          
        })
        
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  async recordPayment(payment,invoiceData,paypalInvoiceId){
    let value = parseFloat(payment).toFixed(2);
    var data = {
      method: 'BANK_TRANSFER',
      payment_date: '2018-05-01',
      amount: {
        currency_code: "USD",
        value: Number(value)
      }
    };
    return userModel.findOne({ _id: invoiceData.userId }).then(async(resp)=>{
      if(resp.paypalConnected){
        const response = await axios.post(`${livePaypalApi}v2/invoicing/invoices/${paypalInvoiceId}/payments`, data, {
        auth: {
          username: resp.clientId,
          password: resp.secretCode,
        },
      })
      return response.data
      }
      
    })

    
  }

  async recordPaymentByInvoice(payment,invoiceData){
    try{
      let value ;
      if(invoiceData.currencyValue){
        value = (payment.amount / invoiceData.currencyValue).toFixed(2)
      }else{
        value = payment.amount; 
      }
      var data = {
        method: "OTHER",
        payment_date: moment(new Date(payment.paymentDate)).format('YYYY-MM-DD'),
        amount: {
          currency_code: "USD",
          value: value
        }
      };
      return userModel.findOne({ _id: invoiceData.userId }).then(async(resp)=>{
        if(resp.paypalConnected){
          return await axios.post(`${livePaypalApi}v2/invoicing/invoices/${invoiceData.paypalInvoiceId}/payments`, data, {
            auth: {
              username: resp.clientId,
              password: resp.secretCode,
            }
          }).then(resp=>{
            return resp.data
          }).catch(error=>{
           console.log(error)
          })
        
        }
        
      })
    }
    catch(error){
      console.log(error)
    }  

  }

  async updateInvoice(req) {
    try {
      const { data } = req.body;
      const userData = await userModel.findOne({ _id: req.userId });
      const response = await axios.put(`${livePaypalApi}v2/invoicing/invoices/${req.body.paypalInvoiceId}`, data, {
        auth: {
          username: userData.clientId,
          password: userData.secretCode,
        },
      });
      if (response) {
        return {
          status: 200,
          success: true,
          message: 'Paypal invoice updated successfully.',
          data: response.data,
        };
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async convertCurrency(req) {
    try{
      const config = {
        method: 'post',
        url: `http://data.fixer.io/api/latest?access_key=6e77b2791e88b4d82161c9e14816a326&base=${req.body.baseCurrency}&symbols=${req.body.symbol}`,
      };
  
      return axios(config).then(async(response) => {
        if (response.data.success) {
          const invoiceData = await invoiceModel.findOne({ _id: ObjectId(req.body.invoiceId) });
          let value = Object.values(response.data.rates)[0];
          invoiceData.currencyValue = value
          invoiceData.convertedAmount=(invoiceData.dueAmount / value).toFixed(2)
          return invoiceData.save().then(resp=>{
            return {
              status: 200,
              success: true,
              data: resp,
            };
          })
          
        }
      })
        .catch((error) => {
          console.log(error);
        });
    }catch(error){
      console.log(error)
    }
    
  }

  async sendPaymentLink(req) {
    try {
      const data = {
        email: req.body.email,
        url: req.body.paymentUrl,
        subject: 'Payment Request',
        companyName: req.body.companyName
      };
      return template.sendPaymentLink(data).then((resp) => {
        return{ status: 200, success: true, message: 'Email sent successfully' }
      })
      
    } catch (error) {
      console.log('Error', error)
      return error;
    }
  }
}

module.exports = new paypalController();
