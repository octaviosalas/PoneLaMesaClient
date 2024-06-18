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
    },
    licenseImage: { 
        type: String,
        required: false
    },
    dniImage: { 
        type: String,
        required: false
    },
})

const Employees = mongoose.model("Employees", employeesSchema)

export default Employees;