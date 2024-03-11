import mongoose from "mongoose";


const expenseSchema = mongoose.Schema({ 
    loadedByName: { 
        type: String
    }, 
    loadedById: { 
        type: String
    },
    typeOfExpense: { 
        type: String
    }, 
    amount: { 
        type: Number
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
    expenseDetail: { 
        type: Array
    },
    providerName: { 
        type: String
    },
    providerId: { 
        type: String
    }
})

const Expenses = mongoose.model("Expenses", expenseSchema)

export default Expenses;