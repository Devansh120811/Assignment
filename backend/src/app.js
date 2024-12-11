import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import AddressRoute from './routes/addressRoute.js'
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}))
app.use(express.json({
    limit: "100mb"
}))
app.use(express.urlencoded({
    extended: true,
    limit: "100mb"
}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api',AddressRoute)
export default app