import mongoose from "mongoose";


const employeesShiftsSchema = mongoose.Schema({ 
    employeeName: { 
        type: String
    }, 
    employeeId: { 
        type: String
    }, 
    realStartTime: { 
        type: String
    },
    closingHour: { 
        type: String
    },    
    startTime: { 
        type: String
    },   
    hours: { 
        type: Number
    },
    minutes: { 
        type: Number
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