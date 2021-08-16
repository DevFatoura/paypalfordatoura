import express from 'express';
import authMiddleware from "../services/auth/auth";
import reportController from '../controller/reportController'

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("enter")
  // res.render('index', { title: 'Express' });
});

router.post('/filterData', authMiddleware.authenticateJWT, function(req, res, next) {
  reportController.filterData(req).then(resp=>{
    res.send(resp);
  }).catch(error=>{
    res.status(500).send(error)
  }) 
});


module.exports = router;
