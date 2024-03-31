import mongoose from "mongoose";


const depositSchema = mongoose.Schema({ 
    productId: { 
        type: String
    }, 
    productName: { 
        type: String
    }, 
    quantity: { 
        type: Number
    }
})

const Deposit = mongoose.model("Deposit", depositSchema)

export default Deposit;