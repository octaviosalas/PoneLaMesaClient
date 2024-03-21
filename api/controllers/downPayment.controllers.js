import DownPayments from "../models/downPayment.js";
import Orders from "../models/orders.js";

export const createNewDownPayment = async (req, res) => { 
    const {downPaymentData} = req.body;
    console.log(req.body);
    try {
       const newDownPaymentData = new DownPayments(req.body);
       const downPaymentSaved = await newDownPaymentData.save();
       if(downPaymentSaved) { 

           const dataToPush = {
             date: req.body.date,
             amount: req.body.amount,
             account: req.body.account,
             voucher: req.body.voucher
           };
   
           await Orders.updateOne(
             { _id: req.body.orderId }, 
             { $push: { downPaymentData: { $each: [dataToPush] } } } 
           );
       }
   
       res.status(200).json(downPaymentSaved);
    } catch (error) {
       res.status(500).json({ error: 'Error al crear la seña' });
       console.log(error);
    }
   }

   
export const getAllDownPayments = async (req, res) => { 
    
}

export const getDownPaymentById = async (req, res) => { 
    
}

export const getDownPaymentByOrderId = async (req, res) => { 
    
}