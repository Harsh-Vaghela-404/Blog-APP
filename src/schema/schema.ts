import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLNonNull } from 'graphql'

export const BlogUserType = new GraphQLObjectType({
    name: 'BlogUserType',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLString },
        updated_at: { type: GraphQLString }
})
})

export const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLNonNull(GraphQLString) },
        author_id: { type: GraphQLNonNull(GraphQLID) },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLNonNull(GraphQLString) }
    })
})

export const PostCommentType = new GraphQLObjectType({
    name: 'PostCommentType',
    fields: () => ({
        id : { type: GraphQLNonNull(GraphQLID) },
        post_id : { type: GraphQLNonNull(GraphQLID) },
        author_id : { type: GraphQLNonNull(GraphQLID) },
        content: { type: GraphQLNonNull(GraphQLString) },
        created_at: { type: GraphQLNonNull(GraphQLString) },
        updated_at: { type: GraphQLNonNull(GraphQLString) }
    })
})
