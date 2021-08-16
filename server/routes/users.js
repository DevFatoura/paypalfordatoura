import express from 'express';
import userController from "./../controller/userController";
import subscriptionController from './../controller/subscriptionController'

const authMiddleware = require("../services/auth/auth");

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/getInviteUser/:id', function(req, res, next) {
  userController.getInviteUser(req).then((resp)=>{
    res.send(resp);
  }).catch(error=>{
    res.status(500).send(error)
  })
});

router.post('/signUp', function(req, res, next) {
  userController.saveUser(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/login', function(req, res, next) {
  userController.checkUser(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});


router.post('/forgetPassword', function(req, res, next) {
  userController.forgetPassword(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});


router.post('/socialLogin', function(req, res, next) {
  userController.socialLogin(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.get("/getUser",authMiddleware.authenticateJWT,function (req, res, next) {
  userController.getUserData(req)
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

router.put("/updateUser",authMiddleware.authenticateJWT,function (req, res, next) {
  userController.updateUser(req)
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

router.put("/updateCompanyDetails",authMiddleware.authenticateJWT,function(req, res, next){
  userController.updateCompanyDetails(req).then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

router.post("/uploadProfile",authMiddleware.authenticateJWT,function(req, res, next){
  userController.uploadProfile(req,res)
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err);
    });
})

router.post("/uploadCompanyLogo",authMiddleware.authenticateJWT,function(req, res, next){
  userController.uploadCompanyLogo(req,res)
    .then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      cosnoel.log(err)
      res.status(500).send(err);
    });
})

router.put('/changePassword',authMiddleware.authenticateJWT,function (req, res, next) {
  userController.changePassword(req).then((resp)=>{
    res.send(resp);
  })
  .catch((err)=>{
    res.status(500).send(err);
  })
})

router.put('/removeImage',authMiddleware.authenticateJWT,function (req, res, next) {
  userController.removeImage(req).then((resp)=>{
    res.send(resp);
  })
  .catch((err)=>{
    res.status(500).send(err);
  })
})

router.put('/removeCompanyLogo',authMiddleware.authenticateJWT,function (req, res, next) {
  userController.removeCompanyLogo(req).then((resp)=>{
    res.send(resp);
  })
  .catch((err)=>{
    res.status(500).send(err);
  })
})

router.post('/resetPassword', function(req, res, next) {
  userController.resetPassword(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});
router.get('/getSubscriptions', authMiddleware.authenticateJWT,function(req, res, next) {

  subscriptionController.getSubscriptionPlan(req).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    res.status(500).send(err);
  })
})

router.post('/subscribePlan',authMiddleware.authenticateJWT,function(req,res,next){
  subscriptionController.subscribePlan(req).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    console.log(err)
    res.status(500).send(err);
  })
})

router.post('/upgradePlan',authMiddleware.authenticateJWT,function(req,res,next){
  subscriptionController.upgradePlan(req).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    console.log(err)
    res.status(500).send(err);
  })
})

router.get('/getSubscribePlan/:id',authMiddleware.authenticateJWT,function(req, res, next) {
  subscriptionController.getCurrentPlan(req).then((resp)=>{
      res.send(resp);
  }).catch(error=>{
      res.status(500).send(error)
  })
});

router.post('/cancelPlan',authMiddleware.authenticateJWT,function(req, res, next){
  subscriptionController.cancelPlan(req).then((resp)=>{
    res.send(resp);
  }).catch(error=>{
    res.status(500).send(error)
  })
})

router.post('/webhookCall',function(req,res){
  try{
    const event = req.body;

    switch (event.type) {
      case 'invoice.payment_succeeded':
        const paymentIntent = event.data.object;
        console.log("payment_intent",event.data.object)
        if(event.data.object.billing_reason=='subscription_cycle'){
          subscriptionController.renewPlan(event.data)

        }
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;

      case 'customer.subscription.updated':
        const paymentMethod = event.data.object;
        console.log("updated",event.data.object)
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a response to acknowledge receipt of the event
    res.json({received: true});

  }catch(error){
    console.log(error)
  }
})

router.post('/verifyUser', function(req, res, next) {
  userController.verifyUser(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/subscribeFreePlan',authMiddleware.authenticateJWT,function(req,res,next){
  subscriptionController.subscribeFreePlan(req).then((resp)=>{
    res.send(resp);
  }).catch((err)=>{
    console.log(err)
    res.status(500).send(err);
  })
})



module.exports = router;
