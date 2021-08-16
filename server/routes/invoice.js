import express from 'express';
import authMiddleware from "../services/auth/auth";
import invoiceController from '../controller/invoiceController'

var router = express.Router();

router.post('/createInvoice',authMiddleware.authenticateJWT, function(req, res, next) {
    invoiceController.creatInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.put('/updateInvoice/:id',authMiddleware.authenticateJWT, function(req, res, next) {
    invoiceController.updateInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.post('/generateInvoiceNumber',authMiddleware.authenticateJWT, function(req, res, next) {
    invoiceController.generateInvoiceNumber(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.post('/saveItem',authMiddleware.authenticateJWT, function(req, res, next) {
    invoiceController.saveItem(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.get('/getItems',authMiddleware.authenticateJWT,function(req, res, next) {
    invoiceController.getItem(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.get('/getInvoices',authMiddleware.authenticateJWT,function(req, res, next) {
    invoiceController.getInvoices(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.get('/getInvoiceById/:id',authMiddleware.authenticateJWT,function(req, res, next) {
    invoiceController.getInvoiceById(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.get('/getInvoiceByNumber/:id',function(req, res, next) {
    invoiceController.getInvoiceByNumber(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.delete('/deleteInvoice/:id',authMiddleware.authenticateJWT, function(req, res, next) {
    invoiceController.deleteInvoiece(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.delete('/permanentDelete/:id',authMiddleware.authenticateJWT,function(req,res,nex){
    invoiceController.permanentDelete(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getDeletedInvoice',authMiddleware.authenticateJWT,function(req, res, next) {
    invoiceController.getDeletedInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.put('/restoreInvoice/:id',authMiddleware.authenticateJWT, function(req, res, next) {
    invoiceController.restoreInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
});

router.put('/payInvoice/:id',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.payInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})


router.get('/getMontlyStatics',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getMontlyStatics(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getQuarterlyStatics',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getQuarterlyStatics(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getYearlyStatic',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getYearlyStatic(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/getSalesReport',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getSalesReport(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/getSalesReportByCurrency',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getSalesReportByCurrency(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/saveTax',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.saveTax(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getTax',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getTaxs(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})
router.post('/getSalesReportForGraph',authMiddleware.authenticateJWT,function(req,res,next){
    console.log(req.body)
    invoiceController.getSalesReportByGraph(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/getGraphDataforWeekly',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getWeekGraphData(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/getGraphDataforMonthly',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getGraphDataforMonthly(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/uploadSendFile',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.uploadSendFile(req,res).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getTotalByCurrency',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getTotalByCurrency(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getTotalByCurrencyStatus',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getTotalByCurrencyStatus(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/getAllCurrencies',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getAllCurrenciesByInvoices(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/getCustomer',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getCustomer(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.get('/filteredInvoice',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getFilteredInvoice(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

router.post('/getInvoiceCount',authMiddleware.authenticateJWT,function(req,res,next){
    invoiceController.getInvoiceCount(req).then((resp)=>{
        res.send(resp);
    }).catch(error=>{
        res.status(500).send(error)
    })
})

module.exports = router;
