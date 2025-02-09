import express from 'express'
import connectDB from './db/db.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
const app= express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser()); 

//routes
import userRouter from './routes/user.routes.js'

//routes declation
app.use("/api/v1/user",userRouter)

//http://localhost:3000/api/vi/user/register


export {app};
