import  express  from "express";
import { connectDb } from "./connections";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./handlers/handlers";

//Dotenv Config
config()
const app = express();

app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

//Connection to the Database 
connectDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err)=>console.log(err))