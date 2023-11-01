import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import { queryDb } from "../connections"
import { BlogUserType, PostType , PostCommentType } from "../schema/schema"
import { hashSync } from "bcryptjs"

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get all user
        bloguser : {
            type: GraphQLList(BlogUserType),
            async resolve(){
                return await queryDb("SELECT * FROM bloguser")
            }
        },
        post : {
            type: GraphQLList(PostType),
            async resolve(){
                return await queryDb("SELECT * FROM post")
            }
        },
        post_comment: {
            type: GraphQLList(PostCommentType),
            async resolve(){
                return await queryDb("SELECT * FROM post_comment")
            }
        }
    }
})

const mutations = new GraphQLObjectType({
    name: "mutations",
    fields: {
        signup:{
            type: BlogUserType,
            args: {
                username: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString)},
                created_at: { type: GraphQLString},
                updated_at: { type: GraphQLString}
            },
            async resolve(parent, args){
                let check_user:any;
                try {
                    const currentDate = new Date()
                    check_user = await queryDb("SELECT * FROM bloguser WHERE email = '"+ args.email +"'" )
                    if (check_user.length > 0) {
                        throw new Error("User already exist")
                    }
                    args.password = hashSync(args.password)
                    console.log("INSERT INTO bloguser( username, email, password, created_at, updated_at ) VALUES('"+args.username+"', '"+ args.email +"', '"+ args.password +"', '"+ currentDate.getTime() +"', '"+ currentDate.getTime()+"')");
                     
                    return await queryDb("INSERT INTO bloguser( username, email, password) VALUES('"+args.username+"', '"+ args.email +"', '"+ args.password +"') RETURNING username, email, password")

                } catch (error) {
                    return new error("User Signup Failed. Please try again")
                }
            }
        }
    }
})

export default new GraphQLSchema({ query : RootQuery, mutation: mutations })
