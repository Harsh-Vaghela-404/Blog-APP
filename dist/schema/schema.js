"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCommentType = exports.PostType = exports.BlogUserType = void 0;
const graphql_1 = require("graphql");
const client_1 = require("@prisma/client");
// import { hashSync } from "bcryptjs";
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '7 days' });
};
exports.BlogUserType = new graphql_1.GraphQLObjectType({
    name: 'BlogUserType',
    fields: () => ({
        id: { type: graphql_1.GraphQLInt },
        username: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        created_at: { type: graphql_1.GraphQLString },
        updated_at: { type: graphql_1.GraphQLString },
        posts: {
            type: (0, graphql_1.GraphQLList)(exports.PostType),
            resolve: async (parent) => {
                // Fetch all posts authored by this user
                return await prisma.post.findMany({
                    where: {
                        author_id: parent.id
                    }
                });
            }
        },
        token: {
            type: graphql_1.GraphQLString,
            resolve: (parent) => generateToken(parent), // Generate the token
        },
        postComments: {
            type: (0, graphql_1.GraphQLList)(exports.PostCommentType),
            resolve: async (parent) => {
                // Fetch all post comments authored by this user
                return await prisma.post_comment.findMany({
                    where: {
                        author_id: parent.id
                    }
                });
            }
        }
    })
});
exports.PostType = new graphql_1.GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        created_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        updated_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        author: {
            type: exports.BlogUserType,
            resolve: async (parent) => {
                // Fetch the author of the post
                return await prisma.bloguser.findUnique({
                    where: {
                        id: parent.author_id
                    }
                });
            }
        },
        comments: {
            type: (0, graphql_1.GraphQLList)(exports.PostCommentType),
            resolve: async (parent) => {
                // Fetch all comments related to this post
                return await prisma.post_comment.findMany({
                    where: {
                        post_id: parent.id
                    }
                });
            }
        }
    })
});
exports.PostCommentType = new graphql_1.GraphQLObjectType({
    name: 'PostCommentType',
    fields: () => ({
        id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        post_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
        content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        created_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        updated_at: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
        author: {
            type: exports.BlogUserType,
            resolve: async (parent) => {
                // Fetch the author of the comment
                return await prisma.bloguser.findUnique({
                    where: {
                        id: parent.author_id
                    }
                });
            }
        },
        post: {
            type: exports.PostType,
            resolve: async (parent) => {
                // Fetch the post to which this comment belongs
                return await prisma.post.findUnique({
                    where: {
                        id: parent.post_id
                    }
                });
            }
        }
    })
});
//# sourceMappingURL=schema.js.map