import express from 'express';
import adminController from "./../controller/adminController";
import authMiddleware from "../services/auth/auth";
import subscriptionController from './../controller/subscriptionController'

var router = express.Router();

router.post('/createSubscription',function(req, res, next){
  subscriptionController.createPlan(req).then(resp=>{
      res.send(resp);
  }).catch((err) => {
      res.status(500).send(err);
    });
})  
router.post("/register", function (req, res, next) {
  return adminController
    .createAdmin(req).then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/loginForAdmin", function (req, res, next) {
  console.log(req.body)
  adminController
      .adminLogin(req)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
});

router.post('/forgetPasswordForAdmin', function(req, res, next) {
  adminController.forgetPassword(req).then((resp)=>{
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/resetPasswordForAdmin', function(req, res, next) {
  adminController.resetPassword(req).then((resp)=>{
    console.log(resp)
    res.send(resp);
  }).catch((err) => {
    res.status(500).send(err);
  });
});



router.get("/getAdmin", authMiddleware.authenticateJWT,(req, res, next) => {
  adminController
      .getAdminData(req,res)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });

  router.post("/uploadAdminImage",  authMiddleware.authenticateJWT,(req, res, next) => {
    console.log(req.body)
    adminController.uploadImage(req)
        .then((resp) => {
          res.send(resp);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });

  router.post("/updateAdminProfile",  authMiddleware.authenticateJWT,(req, res, next) => {
      adminController
          .updateAdminProfile(req)
          .then((resp) => {
            res.send(resp);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
  });

  router.post("/updateAdminPassword",  authMiddleware.authenticateJWT,(req, res, next) => {
    adminController
        .updateAdminPassword(req)
        .then((resp) => {
          res.send(resp);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    });

  router.get("/saleReport",authMiddleware.authenticateJWT, (req, res, next) => {
      adminController.getSaleReport(req)
        .then((resp) => {
          res.send(resp);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
  })

  router.post("/yearlyGraph",authMiddleware.authenticateJWT, (req, res, next) => {
    adminController.getChartData(req)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })

  router.post("/weeklyGraph",authMiddleware.authenticateJWT, (req, res, next) => {
    adminController.weeklyGraph(req)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })

  router.post("/lastMonthGraph",authMiddleware.authenticateJWT,(req,res, next)=>{
    adminController.monthGraph(req)
      .then((resp) => {
        res.send(resp);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  })

  router.get("/getUserlist",authMiddleware.authenticateJWT, (req, res, next) => {
    adminController.getAllUsers(req,res).then((resp) => {
          res.send(resp);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
  });

  router.get("/getSubscriptionHistory",authMiddleware.authenticateJWT,(req,res,next)=>{
    adminController.getSubscriptionHistory(req,res).then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  })

  router.post("/inviteUser", authMiddleware.authenticateJWT,(req, res, next) => {
    adminController.inviteUser(req).then((resp) => {
        res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  })

  router.post('/deleteUseer',authMiddleware.authenticateJWT,(req,res,next) =>{
    adminController.deleteUser(req).then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  })

  router.post('/sendQueryTOAdmin',authMiddleware.authenticateJWT,(req,res,next)=>{
    adminController.sendQuery(req).then((resp) => {
      res.send(resp);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err);
    });
  })


  

module.exports = router;
