import mongoose from "mongoose";


const purchasesSchema = mongoose.Schema({ 
    date: { 
        type: String
    }, 
    day: { 
        type: Number
    }, 
    month: { 
        type: String
    },    
    year: { 
        type: Number
    },  
    creatorPurchase: { 
        type: String
    },  
    total: { 
        type: Number
    },  
    purchaseDetail: { 
        type: Array
    },  
})

const Purchases = mongoose.model("purchases", purchasesSchema)

export default Purchases;