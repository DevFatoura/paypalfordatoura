import express from 'express';
import authMiddleware from "../services/auth/auth";
import paypalController from '../controller/paypalController'
import invoiceController from '../controller/invoiceController'


var router = express.Router();

router.post('/connectpaypal', authMiddleware.authenticateJWT, function(req,res,next){
    // console.log(".......",req.body)
    paypalController.createConnection(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/disconnectPaypal', authMiddleware.authenticateJWT, function(req,res,next){
    // console.log(".......",req.body)
    paypalController.disconnectedPaypal(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/createInvoice',authMiddleware.authenticateJWT,function(req,res,next){
    paypalController.createPaypalDraftInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.status(500).send()
    })
})

router.post('/sendInvoice',authMiddleware.authenticateJWT,function(req,res,next){
    paypalController.sendInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.status(500).send()
    })
})

router.post('/updateInvoice',authMiddleware.authenticateJWT,function(req,res,next){
    paypalController.updateInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.status(500).send()
    })
})

router.post('/paypalWebhook',function(req,res){
    const event = req.body;
    console.log('Webhook Start',JSON.stringify(event));
    invoiceController.payInvoiceByPaypal(event).then(resp=>{
        res.json({received: true});
    }).catch(error=>{
        res.status(500).send(error)

    })
  })

  router.post('/paypalWebhookForRecurring',function(req,res){
    const event = req.body;
    console.log('Webhook Start',JSON.stringify(event));
  })

router.post('/convertCurrency',function(req,res){
    paypalController.convertCurrency(req).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.status(500).send()
    })
})  

router.post('/sendPaymentLink',function(req,res){
    paypalController.sendPaymentLink(req).then((resp)=>{
        res.send(resp);
    }).catch(err=>{
        res.status(500).send()
    })
})



module.exports = router