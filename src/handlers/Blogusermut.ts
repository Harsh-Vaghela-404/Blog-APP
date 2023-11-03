import { GraphQLNonNull, GraphQLString } from "graphql";
import { BlogUserType } from "../schema/schema";
import { generateToken, verifyToken } from "../handlers/jwt";
import { PrismaClient } from "@prisma/client"; 
import { hashSync, compareSync } from "bcryptjs"
const prisma = new PrismaClient();


export const signupMutation = {
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
    }
}

export const loginMutation = {
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
}

//Common function to check if a user with the same email already exists or get the user data by id
export async function check_user(email:string = '', id:number = 0) {
    let is_user_exsist = await prisma.bloguser.findFirst({
        where:{
            ...(id > 0 ? { id } : {}),
            ...(email ? { email } : {})
        }
    })
    return is_user_exsist
}