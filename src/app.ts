import  express  from "express";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import schema from "./handlers/handlers";
import { connectDb } from "./connections";

//Dotenv Config
config()
connectDb()
const app = express();
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})