"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const client_1 = require("@prisma/client");
const Blogusermut_1 = require("./Blogusermut");
const Postmut_1 = require("../handlers/Postmut");
const PostCommentMut_1 = require("../handlers/PostCommentMut");
const prisma = new client_1.PrismaClient();
//Query
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get all user
        bloguser: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogUserType),
            async resolve() {
                return await prisma.bloguser.findMany();
            }
        },
        post: {
            type: (0, graphql_1.GraphQLList)(schema_1.PostType),
            async resolve() {
                return await prisma.post.findMany();
            }
        },
        post_comment: {
            type: (0, graphql_1.GraphQLList)(schema_1.PostCommentType),
            async resolve() {
                return await prisma.post_comment.findMany();
            }
        }
    }
});
//Mutation
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        //User Mutation
        signup: Blogusermut_1.signupMutation,
        login: Blogusermut_1.loginMutation,
        //Post Mutation
        create_post: Postmut_1.create_postMutation,
        update_post: Postmut_1.update_postMutation,
        delete_post: Postmut_1.delete_postMutation,
        // Post Comment Mutation
        add_post_comment: PostCommentMut_1.post_commentMutation
    }
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map