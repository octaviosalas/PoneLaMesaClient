import mongoose from "mongoose";


const subletsSchema = mongoose.Schema({ 
    productsDetail: { 
        type: Array
    }, 
    amount: { 
        type: Number
    }, 
    orderId: { 
        type: String
    },    
    provider: { 
        type: String
    },
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
    status: { 
        type: String
    } 
})

const Sublets = mongoose.model("Sublets", subletsSchema)

export default Sublets;