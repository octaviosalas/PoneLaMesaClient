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
    },
    fixedExpenseType: {
        type: String,
        required: function() { return this.typeOfExpense === 'Gasto Fijo'; }
    },
    subletReferenceId: {
        type: String,
        required: function() { return this.typeOfExpense === 'Sub Alquiler'; }
    },
    purchaseReferenceId: {
        type: String,
        required: function() { return this.typeOfExpense === 'Compra'; }
    },

})

const Expenses = mongoose.model("Expenses", expenseSchema)

export default Expenses;


/* 
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
    },
    fixedExpenseType: {
        type: String,
        required: function() { return this.typeOfExpense === 'Gasto Fijo'; }
    },
    subletReferenceId: {
        type: String,
        required: function() { return this.typeOfExpense === 'Sub Alquiler'; }
    },
    
})

const Expenses = mongoose.model("Expenses", expenseSchema)

export default Expenses;
*/