import  express  from "express";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./handlers/handlers";
import { connectDb } from "./connections";

//Dotenv Config
config()

//Database connection to the local
connectDb()

//graphql api
const app = express();
app.use("/blogpost", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

//Express server
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})