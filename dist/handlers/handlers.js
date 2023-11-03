"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient(); // Initialize the Prisma Client
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import the jsonwebtoken library for JWT token handling
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign(user, "randomString", { expiresIn: 10000 });
};
// Verify JWT token
const verifyToken = (token) => {
    // try {
    console.log(token);
    let verify = jsonwebtoken_1.default.verify(token, "randomString");
    return verify;
    // } catch (error) {
    //     throw new Error('Invalid or expired token.');
    // }
};
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
const mutations = new graphql_1.GraphQLObjectType({
    name: "mutations",
    fields: {
        //user signup
        signup: {
            type: schema_1.BlogUserType,
            args: {
                username: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, args) {
                try {
                    const currentDate = new Date();
                    const hashedPassword = (0, bcryptjs_1.hashSync)(args.password);
                    // Check if a user with the same email already exists
                    const existingUser = await check_user(args.email);
                    if (existingUser) {
                        throw new Error("User with the same email already exists");
                    }
                    const newUser = await prisma.bloguser.create({
                        data: {
                            username: args.username,
                            email: args.email,
                            password: hashedPassword,
                            created_at: currentDate,
                            updated_at: currentDate
                        }
                    });
                    newUser.token = generateToken(newUser);
                    return newUser;
                }
                catch (error) {
                    throw new Error(error);
                }
            },
        },
        //user login
        login: {
            type: schema_1.BlogUserType,
            args: {
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            async resolve(parent, args) {
                let is_blog_user;
                try {
                    is_blog_user = await check_user(args.email);
                    if (!is_blog_user) {
                        throw new Error(" No user found with registered email, Please Signup first");
                    }
                    let decrypted_pass = (0, bcryptjs_1.compareSync)(args.password, is_blog_user?.password);
                    if (!decrypted_pass) {
                        throw new Error(" Invalid password for " + args.email + "");
                    }
                    is_blog_user.token = generateToken(is_blog_user);
                    return is_blog_user;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
        },
        //create post
        create_post: {
            type: schema_1.PostType,
            args: {
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            async resolve(parent, args, context) {
                try {
                    const { authorization } = context.headers;
                    // console.log( context.headers);
                    const user = verifyToken(authorization);
                    if (!user) {
                        throw new Error('Invalid or expired token.');
                    }
                    let is_blog_user = await check_user('', args.author_id);
                    if (!is_blog_user) {
                        throw new Error(" You are not authorized to add blog ");
                    }
                    const currentDate = new Date();
                    const newPost = await prisma.post.create({
                        data: {
                            title: args.title,
                            content: args.content,
                            author_id: args.author_id,
                            created_at: currentDate,
                            updated_at: currentDate
                        }
                    });
                    return newPost;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
        },
        //update post
        update_post: {
            type: schema_1.PostType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                title: { type: graphql_1.GraphQLString },
                content: { type: graphql_1.GraphQLString },
                author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            async resolve(parent, args, context) {
                try {
                    const { authorization } = context.headers;
                    const user = verifyToken(authorization);
                    if (!user) {
                        throw new Error('Invalid or expired token.');
                    }
                    let is_blog_user = await prisma.post.findFirst({
                        where: {
                            author_id: args.author_id,
                            id: args.id
                        }
                    });
                    if (!is_blog_user) {
                        throw new Error(" You are not authorized to update blog ");
                    }
                    const currentDate = new Date();
                    const updatedPost = await prisma.post.update({
                        where: {
                            id: args.id
                        },
                        data: {
                            ...{ title: args.title },
                            ...{ content: args.content },
                            updated_at: currentDate
                        }
                    });
                    return updatedPost;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
        },
        //delete post
        delete_post: {
            type: schema_1.PostType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) }
            },
            async resolve(parent, args, context) {
                try {
                    const { authorization } = context.headers;
                    const user = verifyToken(authorization);
                    if (!user) {
                        throw new Error('Invalid or expired token.');
                    }
                    let is_authorized = await prisma.post.findFirst({
                        where: {
                            author_id: args.author_id,
                            id: args.id
                        }
                    });
                    if (!is_authorized) {
                        throw new Error(" You are not authorized to delete blog ");
                    }
                    const deletedPost = await prisma.post.delete({
                        where: {
                            id: args.id
                        }
                    });
                    await prisma.post_comment.deleteMany({
                        where: {
                            post_id: args.id
                        }
                    });
                    return deletedPost;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
        },
        //add comment
        add_post_comment: {
            type: schema_1.PostCommentType,
            args: {
                post_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                author_id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            async resolve(parent, args, context) {
                try {
                    const { authorization } = context.headers;
                    const user = verifyToken(authorization);
                    if (!user) {
                        throw new Error('Invalid or expired token.');
                    }
                    let is_post_exist = await prisma.post.findFirst({
                        where: {
                            id: args.post_id
                        }
                    });
                    if (!is_post_exist) {
                        throw new Error(" Post Not Found ");
                    }
                    let is_blog_user = await check_user('', args.author_id);
                    console.log(is_blog_user);
                    if (!is_blog_user) {
                        throw new Error(" User Not Found ");
                    }
                    const currentDate = new Date();
                    const newComment = await prisma.post_comment.create({
                        data: {
                            post_id: args.post_id,
                            author_id: args.author_id,
                            content: args.content,
                            created_at: currentDate,
                            updated_at: currentDate
                        }
                    });
                    return newComment;
                }
                catch (error) {
                    throw new Error(error);
                }
            }
        }
    }
});
async function check_user(email = '', id = 0) {
    let is_user_exsist = await prisma.bloguser.findFirst({
        where: {
            ...(id > 0 ? { id } : {}),
            ...(email ? { email } : {})
        }
    });
    return is_user_exsist;
}
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: mutations });
//# sourceMappingURL=handlers.js.map