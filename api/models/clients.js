import mongoose from "mongoose";


const clientsSchema = mongoose.Schema({ 
    name: { 
        type: String
    }, 
    telephone: { 
        type: Number
    }, 
    dni: { 
        type: String
    },    
    typeOfClient: { 
        type: String
    },   
    home: { 
        type: String
    },
    clientDebt: { 
        type: Array
    }
})

const Clients = mongoose.model("clients", clientsSchema)

export default Clients;