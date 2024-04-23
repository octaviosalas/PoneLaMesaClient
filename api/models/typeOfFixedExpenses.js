import mongoose from "mongoose";

const typeFixedExpensesSchema = mongoose.Schema({ 
    name: { 
        type: String
    }
})

const typeFixedExpenses = mongoose.model("typeFixedExpenses", typeFixedExpensesSchema)

export default typeFixedExpenses;