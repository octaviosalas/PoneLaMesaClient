import mongoose from "mongoose";


const usersSchema = mongoose.Schema({ 
    email: { 
        type: String
    }, 
    name: { 
        type: String
    }, 
    password: { 
        type: String
    },    
    rol: { 
        type: String
    },   
})

const Users = mongoose.model("users", usersSchema)

export default Users;