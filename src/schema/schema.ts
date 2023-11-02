import { GraphQLObjectType,  GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql'
import { PrismaClient } from "@prisma/client";
// import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();


export const BlogUserType = new GraphQLObjectType({
    name: 'BlogUserType',
    fields: () => ({
        id: { type: GraphQLInt },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString },
        posts: {
            type: GraphQLList(PostType),
            resolve: async (parent) => {
              // Fetch all posts authored by this user
              return await prisma.post.findMany({
                where: {
                  author_id: parent.id
                }
              });
            }
        },
        postComments: {
            type: GraphQLList(PostCommentType),
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
})

export const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        author_id: { type: GraphQLNonNull(GraphQLInt) },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLNonNull(GraphQLString) },
        author: {
            type: BlogUserType,
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
            type: GraphQLList(PostCommentType),
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
})

export const PostCommentType = new GraphQLObjectType({
    name: 'PostCommentType',
    fields: () => ({
        id : { type: GraphQLNonNull(GraphQLInt) },
        post_id : { type: GraphQLNonNull(GraphQLInt) },
        author_id : { type: GraphQLNonNull(GraphQLInt) },
        content: { type: GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLNonNull(GraphQLString) },
        author: {
            type: BlogUserType,
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
            type: PostType,
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
})
