import mongoose from "mongoose";

const providersChema = mongoose.Schema({ 
    name: { 
        type: String,
        require: true
    }, 
    telephone: { 
        type: Number,
        require: true
    }, 
    email: { 
        type: String,
        require: true
    }, 
    
})

const Providers = mongoose.model("Providers", providersChema)

export default Providers;