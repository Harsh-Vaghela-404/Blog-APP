"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const express_graphql_1 = require("express-graphql");
const handlers_1 = __importDefault(require("./handlers/handlers"));
const connections_1 = require("./connections");
//Dotenv Config
(0, dotenv_1.config)();
//Database connection to the local
(0, connections_1.connectDb)();
//graphql api
const app = (0, express_1.default)();
app.use("/blogpost", (0, express_graphql_1.graphqlHTTP)({
    schema: handlers_1.default,
    graphiql: true
}));
//Express server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map