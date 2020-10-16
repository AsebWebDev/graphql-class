import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        if (args.data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer.')
        }

        const password = await bcrypt.hash(args.data.password, 10)
        console.log("createUser -> password", typeof(password))
        const user = await prisma.mutation.createUser({
            data: {
                email: args.data.email,
                name: args.data.name,
                password: "password"
            }
        })
        console.log("createUser -> user", user)

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }

    },
    async login(parent, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if (!user) {
            throw new Error('user - Unable to login')
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if (!isMatch) {
            throw new Error('password - Unable to login')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    async deleteUser(parent, args, { prisma }, info) {
        return await prisma.mutation.deleteUser( { 
            where: { id: args.id }
        }, info) 
    },

    async updateUser(parent, args, { prisma }, info) {
        return await prisma.mutation.updateUser({
            data: args.data,
            where: { id: args.id }
        }, info)
    },
    async createPost(parent, args, { prisma }, info) {
        const userExists = await prisma.exists.User({ id: args.data.author})
 
        if (!userExists) {
            throw new Error('User not found')
        }
 
        return prisma.mutation.createPost({
            data: {
                ...args.data,
                author: {
                    connect: {
                        id: args.data.author
                    }
                }
            },
        }, info)
    },
    deletePost(parent, args, { prisma }, info) {
        return prisma.mutation.deletePost({
            where: { id: args.id }
        }, info)
    },
    async updatePost(parent, args, { prisma }, info) {
        return await prisma.mutation.updatePost({
            data: args.data,
            where: { id: args.id }
        }, info)
    },
    createComment(parent, args, { prisma }, info){
        return prisma.mutation.createComment({
            data: {
                ...args.data, 
                author: {
                    connect: {
                        id: args.data.author
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    deleteComment(parent, args, { prisma }, info) {
        console.log("deleteComment -> args", args)
        return prisma.mutation.deleteComment({
            where: { 
                    id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma }, info) {
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    }
}

export { Mutation as default }