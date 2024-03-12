import mongoose from "mongoose";


const subletsSchema = mongoose.Schema({ 
    productsDetail: { 
        type: Array
    }, 
    amount: { 
        type: Number
    }, 
    provider: { 
        type: String
    },
    providerId: { 
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
    used: { 
        type: Boolean
    }, 
    observation: { 
        type: String
    },
})

const Sublets = mongoose.model("Sublets", subletsSchema)

export default Sublets;