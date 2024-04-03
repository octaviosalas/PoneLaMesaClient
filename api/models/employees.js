import mongoose from "mongoose";


const employeesSchema = mongoose.Schema({ 
    name: { 
        type: String
    }, 
    dni: { 
        type: String
    },
    hourAmount: { 
        type: Number
    }
})

const Employees = mongoose.model("Employees", employeesSchema)

export default Employees;