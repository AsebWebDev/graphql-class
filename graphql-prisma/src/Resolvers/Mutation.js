import { printIntrospectionSchema } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email})

        if (emailTaken) {
            throw new Error('Email taken')
        }

        return await prisma.mutation.createUser({
            data: args.data
        }, info)

    },
    async deleteUser(parent, args, { prisma }, info) {
        const userExists = await prisma.exists.User({ id: args.id  })

        try {
            return await prisma.mutation.deleteUser( { 
                where: { id: args.id }
            }, info) 
        } 
        
        catch (e){
            throw new Error('User not found')
        }
    },
    
    updateUser(parent, args, { db }, info) {
        const {id, data } = args
        const user = db.users.find((user) => user.id === id)
        if (!user) { throw new Error('User not found')}

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)
            if (emailTaken) { throw new Error('Email is taken')}
            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user


    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User not found')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)
        // if (post.published) pubsub.publish('post', { 
        //     post: {
        //         mutation: 'CREATED',
        //         data: post
        //     }
        // })
        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('User not found')
        }

        const [post] = db.posts.splice(postIndex, 1) // destructure array, we only got 1 item, so its easier to read
        db.comments = db.comments.filter((comment) => comment.post !== args.id)
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const {id, data } = args
        const post = db.posts.find((post) => post.id === id)
        const originalPost = { ... post } 

        if (!post) { throw new Error('Post not found')}

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published
            // originial post is published, new is unpublished
            if (originalPost.published && !post.published) {
                // deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            // originial post is unpublished, new is published
            } else if (!originalPost.published && post.published) {
                // created 
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, { 
            comment: {
                mutation: 'CREATED',
                data: comment
            }
         })
        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found')
        }

        const [comment] = db.comments.splice(commentIndex, 1)
        db.comments = db.comments.filter((comment) => comment.comment !== args.id)
        pubsub.publish(`comment ${args.id}`, { 
            comment: {
                mutation: 'DELETED',
                data: comment
            }
         })
        return comment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const {id, data } = args
        const comment = db.comments.find((comment) => comment.id === id)
        const originalComment = { ... comment }
        if (!comment) { throw new Error('Comment not found')}

        if (typeof data.text === 'string') {
            comment.text = data.text
            if (originalComment.text !== comment.text) {
                pubsub.publish(`comment ${args.data.post}`, { 
                    comment: {
                        mutation: 'UPDATED',
                        data: comment
                    }
                 })
            }
            
        }

        return comment
    }
}

export { Mutation as default }