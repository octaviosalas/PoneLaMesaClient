import mongoose from "mongoose";


const employeesShiftsSchema = mongoose.Schema({ 
    employeeName: { 
        type: String
    }, 
    employeeId: { 
        type: String
    }, 
    closingHour: { 
        type: String
    },    
    startTime: { 
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
    date: { 
        type: String
    },   
    observations: { 
        type: String
    }, 
    activities: { 
        type: Array
    },   
})

const EmployeesShifts = mongoose.model("EmployeesShifts", employeesShiftsSchema)

export default EmployeesShifts;