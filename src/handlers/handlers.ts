import {  GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import { queryDb } from "../connections"
import { BlogUserType, PostType , PostCommentType } from "../schema/schema"
import { PrismaClient } from "@prisma/client"; 
import { hashSync, compareSync } from "bcryptjs"
const prisma = new PrismaClient(); // Initialize the Prisma Client
import jwt from 'jsonwebtoken'; // Import the jsonwebtoken library for JWT token handling

const generateToken = (user) => {
    return jwt.sign(user,"randomString",{expiresIn: 10000});
};

// Verify JWT token
const verifyToken = (token) => {
    // try {
        console.log(token);
        let verify = jwt.verify(token, "randomString");
        return verify
    // } catch (error) {
    //     throw new Error('Invalid or expired token.');
    // }
};

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get all user
        bloguser : {
            type: GraphQLList(BlogUserType),
            async resolve(){
                return await prisma.bloguser.findMany()
            }
        },
        post : {
            type: GraphQLList(PostType),
            async resolve(){
                return await prisma.post.findMany()
            }
        },
        post_comment: {
            type: GraphQLList(PostCommentType),
            async resolve(){
                return await prisma.post_comment.findMany()
            }
        }
    }
})


const mutations = new GraphQLObjectType({
    name: "mutations",
    fields: {
    //user signup
      signup: {
        type: BlogUserType,
        args: {
          username: { type: GraphQLNonNull(GraphQLString) },
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
        },
        async resolve(parent, args) {
          try {
            const currentDate = new Date();
            const hashedPassword = hashSync(args.password);

            // Check if a user with the same email already exists
            const existingUser = await check_user(args.email)
            
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
          } catch (error) {
            throw new Error(error);
          }
        },
      },
      //user login
      login: {
        type: BlogUserType,
        args:{
            email:{type:GraphQLNonNull(GraphQLString)},
            password:{type:GraphQLNonNull(GraphQLString)}
        },
        async resolve(parent, args) {
            let is_blog_user:any
            try{
                is_blog_user = await check_user(args.email)

                if(!is_blog_user){
                    throw new Error(" No user found with registered email, Please Signup first")
                }

                let decrypted_pass = compareSync(args.password, is_blog_user?.password)
                
                if(!decrypted_pass){
                    throw new Error(" Invalid password for "+ args.email +"")
                }
                is_blog_user.token = generateToken(is_blog_user);
                return is_blog_user;
             }catch(error){
                throw new Error(error)
            }
        }
    },
    //create post
    create_post: {
        type: PostType,
        args:{
            title:{type:GraphQLNonNull(GraphQLString)},
            content:{type:GraphQLNonNull(GraphQLString)},
            author_id:{type:GraphQLNonNull(GraphQLInt)}
        },
        async resolve(parent, args, context) {
            try{
                const { authorization } = context.headers;
                // console.log( context.headers);
                
                const user = verifyToken(authorization);
                if (!user) {
                    throw new Error('Invalid or expired token.');
                }

                let is_blog_user = await check_user('',args.author_id)
                if(!is_blog_user){
                    throw new Error(" You are not authorized to add blog ")
                }

                const currentDate = new Date();
                const newPost = await prisma.post.create({
                    data:{
                        title:args.title,
                        content:args.content,
                        author_id:args.author_id,
                        created_at:currentDate,
                        updated_at:currentDate
                    }
                })
                return newPost
            }catch(error){
                throw new Error(error)
            }
        
        }
    },
    //update post
    update_post:{
        type:PostType,
        args:{
            id:{type:GraphQLNonNull(GraphQLInt)},
            title:{type:GraphQLString},
            content:{type:GraphQLString},
            author_id:{type:GraphQLNonNull(GraphQLInt)}
        },
        async resolve(parent, args, context) {
            try{
                const { authorization } = context.headers;
                const user = verifyToken(authorization);
                if (!user) {
                    throw new Error('Invalid or expired token.');
                }

                let is_blog_user = await prisma.post.findFirst({
                    where:{
                        author_id:args.author_id,
                        id:args.id
                    }
                })
                if(!is_blog_user){
                    throw new Error(" You are not authorized to update blog ")
                }
                const currentDate = new Date();
                const updatedPost = await prisma.post.update({
                    where:{
                        id:args.id
                    },
                    data:{
                        ...{title:args.title},
                        ...{content:args.content},
                        updated_at:currentDate
                    }
                })
                return updatedPost
            }catch(error){
                throw new Error(error)
            }
        }
    },
    //delete post
    delete_post:{
        type: PostType,
        args:{
            id:{type:GraphQLNonNull(GraphQLInt)},
            author_id:{type:GraphQLNonNull(GraphQLInt)}
        },
        async resolve(parent,args, context){
            try{
                const { authorization } = context.headers;
                const user = verifyToken(authorization);
                if (!user) {
                    throw new Error('Invalid or expired token.');
                }

                let is_authorized = await prisma.post.findFirst({
                    where:{
                        author_id:args.author_id,
                        id:args.id
                    }
                })
                if(!is_authorized){
                    throw new Error(" You are not authorized to delete blog ")
                }
                const deletedPost = await prisma.post.delete({
                    where:{
                        id:args.id
                    }
                })

                await prisma.post_comment.deleteMany({
                    where:{
                        post_id:args.id
                    }
                })
                return deletedPost
            
            } catch(error){
                throw new Error(error)
            }
        }
    },
    //add comment
    add_post_comment:{
        type: PostCommentType,
        args:{
            post_id: {type:GraphQLNonNull(GraphQLInt)},
            author_id: {type:GraphQLNonNull(GraphQLInt)},
            content: {type:GraphQLNonNull(GraphQLString)}
        },
        async resolve(parent,args, context){
            try{
                const { authorization } = context.headers;
                const user = verifyToken(authorization);
                if (!user) {
                    throw new Error('Invalid or expired token.');
                }
                let is_post_exist = await prisma.post.findFirst({
                    where:{
                        id:args.post_id
                    }
                })
                if(!is_post_exist){
                    throw new Error(" Post Not Found ")
                }

                let is_blog_user = await check_user('',args.author_id)
                console.log(is_blog_user);
                if(!is_blog_user){
                    throw new Error(" User Not Found ")
                }

                const currentDate = new Date();
                const newComment = await prisma.post_comment.create({
                    data:{
                        post_id:args.post_id,
                        author_id:args.author_id,
                        content:args.content,
                        created_at:currentDate,
                        updated_at:currentDate
                    }
                })
                return newComment
            }
             catch(error){
                throw new Error(error)
            }
        }
    }
}

});
async function check_user(email:string = '', id:number = 0) {
    let is_user_exsist = await prisma.bloguser.findFirst({
        where:{
            ...(id > 0 ? { id } : {}),
            ...(email ? { email } : {})
        }
    })

    return is_user_exsist
}
export default new GraphQLSchema({ query : RootQuery, mutation: mutations })
