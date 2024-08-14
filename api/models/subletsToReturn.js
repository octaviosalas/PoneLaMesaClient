import mongoose from "mongoose";

const subletsToReturnSchema = mongoose.Schema({ 
    productId: { 
        type: String
    }, 
    productName: { 
        type: String
    }, 
    quantity: { 
        type: Number
    },
    productPrice: { 
        type: Number
    }
})

const subletsToReturn = mongoose.model("subletsToReturn", subletsToReturnSchema)

export default subletsToReturn;