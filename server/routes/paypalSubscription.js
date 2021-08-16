import express from 'express';
import authMiddleware from "../services/auth/auth";
import paypalSubscriptionController from "../controller/paypalSubscriptionController"


var router = express.Router();

router.post('/createSubscription', function(req,res,next){
    paypalSubscriptionController.createSubscription(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getPlans',function(req, res){
    paypalSubscriptionController.getPlans().then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/subscribePlan',authMiddleware.authenticateJWT,function(req,res){
    paypalSubscriptionController.subscribePlan(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/verifyStatus',authMiddleware.authenticateJWT,function(req,res){
    paypalSubscriptionController.verifyStatus(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/cancelPlan',authMiddleware.authenticateJWT,function(req,res){
    paypalSubscriptionController.cancelCurrentSubscription(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

module.exports = router