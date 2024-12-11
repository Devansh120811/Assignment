import {dbConnect} from "./db/dbConnect.js";
import dotenv from 'dotenv'
import app from './app.js'
dotenv.config({
    path: './.env'
})
try {
    dbConnect().then(() => {
        const port = process.env.PORT
        app.listen(port, () => {
            console.log(`App listening at port ${port}`)
        })
    }).catch((err) => {
        console.error("Error: ", err)
    })

} catch (error) {
    console.log("Error: ", error)
}
