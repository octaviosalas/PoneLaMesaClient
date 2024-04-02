import mongoose from "mongoose";


const employeesSchema = mongoose.Schema({ 
    name: { 
        type: String
    }, 
    dni: { 
        type: String
    }
})

const Employees = mongoose.model("Employees", employeesSchema)

export default Employees;