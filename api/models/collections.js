import mongoose from "mongoose";


const collectionsSchema = mongoose.Schema({ 
    orderId: { 
        type: String
    }, 
    client: { 
        type: String
    }, 
    orderDetail: { 
        type: Array
    }, 
    date: { 
        type: String
    },    
    day: { 
        type: String
    },   
    month: { 
        type: String
    },   
    year: { 
        type: String
    },   
    amount: { 
        type: String
    },   
    account: { 
        type: String
    },   
    loadedBy: { 
        type: String
    },   
})

const Collections = mongoose.model("Collections", collectionsSchema)

export default Collections;