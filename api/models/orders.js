import mongoose from "mongoose";


const ordersSchema = mongoose.Schema({ 
    orderCreator: { 
        type: String
    },
    orderStatus: { 
       type: String
    },
    orderNumber: { 
        type: Number
    },
    client: { 
        type: String
    }, 
    typeOfClient: { 
        type: String
    },
    placeOfDelivery: { 
        type: String
    }, 
    dateOfDelivery: { 
        type: String
    },    
    returnDate: { 
        type: String
    },  
    returnPlace: { 
        type: String
    },   
    orderDetail: { 
        type:Array,
    },  
    date: { 
        type: String
    },  
    total: { 
        type: Number
    },
    month: { 
        type: String
    },
    year: { 
        type: Number
    },
    day: {
        type: Number
    }
})

const Orders = mongoose.model("Orders", ordersSchema)

export default Orders;

