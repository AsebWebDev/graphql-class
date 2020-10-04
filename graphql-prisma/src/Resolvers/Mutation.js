import { printIntrospectionSchema } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        return await prisma.mutation.createUser({
            data: args.data
        }, info)

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