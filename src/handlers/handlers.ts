import { GraphQLList, GraphQLObjectType, GraphQLSchema } from "graphql"
import { BlogUserType, PostType , PostCommentType } from "../schema/schema"
import { PrismaClient } from "@prisma/client"; 
import { signupMutation , loginMutation } from "./Blogusermut";
import { create_postMutation, update_postMutation, delete_postMutation } from "../handlers/Postmut"
import { post_commentMutation } from "../handlers/PostCommentMut"

const prisma = new PrismaClient();

//Query
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

//Mutation
const mutations = new GraphQLObjectType({
    name: "mutations",
    fields: {
        //User Mutation
        signup: signupMutation,
        login: loginMutation,
        //Post Mutation
        create_post: create_postMutation,
        update_post:update_postMutation,
        delete_post:delete_postMutation,
        // Post Comment Mutation
        add_post_comment:post_commentMutation
    }

});
export default new GraphQLSchema({ query : RootQuery, mutation: mutations })
