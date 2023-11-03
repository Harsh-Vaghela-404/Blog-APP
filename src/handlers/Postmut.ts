import { GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";
import { PostType } from "../schema/schema"
import { verifyToken } from "../handlers/jwt";
import { PrismaClient } from "@prisma/client"; 
import { check_user } from "./Blogusermut";
const prisma = new PrismaClient();

export const create_postMutation ={
    type: PostType,
    args:{
        title:{type:GraphQLNonNull(GraphQLString)},
        content:{type:GraphQLNonNull(GraphQLString)},
        author_id:{type:GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, context) {
        try{
            const { token } = context.headers;
            const user = verifyToken(token);
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
}

export const update_postMutation ={
    type:PostType,
    args:{
        id:{type:GraphQLNonNull(GraphQLInt)},
        title:{type:GraphQLString},
        content:{type:GraphQLString},
        author_id:{type:GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent, args, context) {
        try{
            const { token } = context.headers;
            const user = verifyToken(token);
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
}

export const delete_postMutation ={
    type: PostType,
    args:{
        id:{type:GraphQLNonNull(GraphQLInt)},
        author_id:{type:GraphQLNonNull(GraphQLInt)}
    },
    async resolve(parent,args, context){
        try{
            const { token } = context.headers;
            const user = verifyToken(token);
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
}