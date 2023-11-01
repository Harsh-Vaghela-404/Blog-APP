import  express  from "express";

import { config } from "dotenv";

//Dotenv Config
config()
const app = express();

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})