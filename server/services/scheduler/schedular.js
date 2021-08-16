var cron = require('node-cron');
var invoiceController = require('./../../controller/invoiceController')
var userController = require('./../../controller/userController')


function setUpSchedule() {
  
    cron.schedule('*/05 * * * *', () => { 
      console.log("enter")
      invoiceController.getInvoicesForDate()
   
   })
   cron.schedule('0 0 * * *', () => { 
      userController.calculteSubscritption()
   
   })
   
  


}


module.exports = { attachJobs: setUpSchedule };