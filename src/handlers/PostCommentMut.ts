import { GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql";
import { PostCommentType } from "../schema/schema";
import { verifyToken } from "../handlers/jwt";
import { PrismaClient } from "@prisma/client"; 
import { check_user } from "./Blogusermut";
const prisma = new PrismaClient();

export const post_commentMutation = {
    type: PostCommentType,
    args:{
        post_id: {type:GraphQLNonNull(GraphQLInt)},
        author_id: {type:GraphQLNonNull(GraphQLInt)},
        content: {type:GraphQLNonNull(GraphQLString)}
    },
    async resolve(parent,args, context){
        try{
            const { token } = context.headers;
            const user = verifyToken(token);
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
        }catch(error){
            throw new Error(error)
        }
    }
}