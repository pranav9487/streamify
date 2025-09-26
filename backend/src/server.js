import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDb } from './lib/db.js';
import cookieParser from "cookie-parser"
import cros from 'cors';


dotenv.config();

const app = express()
const PORT  = process.env.PORT

app.use(cros({
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies to be sent from the frontend
}))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello from the server")
})

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/chat",chatRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectDb();
})