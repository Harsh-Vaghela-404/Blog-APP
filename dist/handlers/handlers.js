"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const connections_1 = require("../connections");
const schema_1 = require("../schema/schema");
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get all user
        bloguser: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogUserType),
            async resolve() {
                return await (0, connections_1.queryDb)("SELECT * FROM bloguser");
            }
        },
        post: {
            type: (0, graphql_1.GraphQLList)(schema_1.PostType),
            async resolve() {
                return await (0, connections_1.queryDb)("SELECT * FROM post");
            }
        },
        post_comment: {
            type: (0, graphql_1.GraphQLList)(schema_1.PostCommentType),
            async resolve() {
                return await (0, connections_1.queryDb)("SELECT * FROM post_comment");
            }
        }
    }
});
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        signup: {
            type: schema_1.BlogUserType,
            args: {
                username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                created_at: { type: graphql_1.GraphQLString },
                updated_at: { type: graphql_1.GraphQLString }
            },
            async resolve(parent, args) {
                let check_user;
                try {
                    const currentDate = new Date();
                    check_user = await (0, connections_1.queryDb)("SELECT * FROM bloguser WHERE email = '" + args.email + "'");
                    if (check_user.length > 0) {
                        throw new Error("User already exist");
                    }
                    args.password = (0, bcryptjs_1.hashSync)(args.password);
                    console.log("INSERT INTO bloguser( username, email, password, created_at, updated_at ) VALUES('" + args.username + "', '" + args.email + "', '" + args.password + "', '" + currentDate.getTime() + "', '" + currentDate.getTime() + "')");
                    return await (0, connections_1.queryDb)("INSERT INTO bloguser( username, email, password) VALUES('" + args.username + "', '" + args.email + "', '" + args.password + "') RETURNING username, email, password");
                }
                catch (error) {
                    return new error("User Signup Failed. Please try again");
                }
            }
        }
    }
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map