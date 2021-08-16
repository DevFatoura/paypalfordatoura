import mongoose from 'mongoose';
import invoices from '../models/invoiceModel';
const invoiceModel = mongoose.model("Invoice");
const moment = require("moment");


class reportController{
    async filterData(req) {
        try {
            var query= {};
            query.userId=req.userId;
            query.isDeleted = false;
            if(req.body.type){
                query.type= req.body.type
            }
            if(req.body.fromDate){
                query.createdAt={ $gte: new Date(req.body.fromDate),$lte: `${req.body.endDate}T23:59:59.994Z` }
            }
            if(req.body.status !== 'all invoices') {
                query.status = req.body.status;
            }
            let result = await invoiceModel.find(query).select({ companyLogo: 0 }).sort({_id:-1}).exec();
            if(result.length) {
                return {
                    status:200,
                    success:true,
                    result:result
                }
            } else {
                return {
                    status:400,
                    success:true,
                    result:[],
                    message:"Data Not found"
                }
            }
        } catch(error) {
            console.log(error);
            return error;
        }

    }
}
module.exports = new reportController();
