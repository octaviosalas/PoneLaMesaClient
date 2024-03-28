import mongoose from "mongoose";


const cleaningSchema = mongoose.Schema({ 
    productId: { 
        type: String
    }, 
    productName: { 
        type: String
    }, 
    quantity: { 
        type: String
    }
})

const Cleaning = mongoose.model("Cleaning", cleaningSchema)

export default Cleaning;