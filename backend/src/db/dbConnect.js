import mongoose from 'mongoose'
import {DBNAME} from '../constant.js'

export const dbConnect = async ()=>{
    try {
        const connect  = await mongoose.connect(`${process.env.MONGODB_URL}${DBNAME}`)
        console.log(`MongoDB connected successfully at ${connect.connection.host}`)
    } catch (error) {
        throw new Error("Error While Connecting to Database.")
    }

}