import mongoose from "mongoose";


const downPaymentSchema = mongoose.Schema({ 
    orderId: { 
        type: String
    }, 
    client: { 
        type: String
    },
    clientId: { 
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
        type: Number
    },   
    amount: { 
        type: Number
    },
    account: { 
        type: String
    },
    loadedBy: { 
        type: String
    },
    voucher: { 
        type: String
    }

})

const DownPayments = mongoose.model("DownPayments", downPaymentSchema)

export default DownPayments;