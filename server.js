import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb_connection.js'
import doctorRoutes from './routers/doctor_routes.js'
import path from 'path'
import cookieParser from 'cookie-parser'

dotenv.config()

await connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get('/', (req, res) => {
  res.send('Hello from the backend!')
})

app.use('/api/doctor', doctorRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})