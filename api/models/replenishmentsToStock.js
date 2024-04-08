import mongoose from "mongoose";


const replenishmentsToStockSchema = mongoose.Schema({ 
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
    home: { 
        type: String
    },
    shift: { 
        type: String
    },
    replenishDetail: { 
        type: Array
    }
})

const ReplenishmentsToStock = mongoose.model("replenishmentsToStock", replenishmentsToStockSchema)

export default ReplenishmentsToStock;