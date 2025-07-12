import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
export default async function connectToDb(){
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://amp8799:qsAacCm7wTLtCwYo@cluster0.lcgbu.mongodb.net/odoo-hackathon")
        if(!connectionInstance){
            console.log("Error while connecting DB")
        }
        console.log(`Connected to ${connectionInstance.connection.name} DB`)
        
    } catch (error) {
        console.log("Error while connecting to DB", error);
    }
}