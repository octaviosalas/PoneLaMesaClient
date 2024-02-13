import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDataBase = () => {
    mongoose.connect(process.env.MONGODB_URL)
      .then(() => { 
        console.log("Successful connection to your poneLaMesa  Database ✔");
      })
      .catch(err => {
        console.log("Error on connection to your poneLaMesa Test Database 👎");
        console.log(err); 
      });
  }
export default connectDataBase;