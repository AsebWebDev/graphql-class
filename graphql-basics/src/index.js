import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
    {
        id: "1",
        name: "André",
        email: "a.sebastian@test.de"
    },
    {
        id: "2",
        name: "Franzi",
        email: "franzi@test.de",
        age: 18
    },
    {
        id: "3",
        name: "Nina",
        email: "Nina@test.de",
        age: 87
    }
]

const posts = [
    {
        id: "10",
        title: "My first post",
        body: "What a life!",
        published: true,
        author: "1"
    },
    {
        id: "20",
        title: "My second post",
        body: "What a nice life!",
        published: true,
        author: "1"
    },
    {
        id: "30",
        title: "My third post",
        body: "What an awesome life!",
        published: false,
        author: "3"
    }
]

const comments = [
    {
        id: "111",
        text: "What a nice comment!",
        author: "1",
        post: "10"
    },
    {
        id: "222",
        text: "What a great comment!",
        author: "2",
        post: "20"
    },
    {
        id: "333",
        text: "What a crazy comment!",
        author: "3",
        post: "30"
    },
    {
        id: "444",
        text: "What a strange comment!",
        author: "2",
        post: "30"
    }
]

// Type definitions (schema)
const typeDefs = `
    type Query {
        me: User!
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int) : User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, author: ID!, post: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID! 
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },

        me () {
            return {
                id: "122323",
                name: "Andre",
                email: "a.sebastian@test.de"
            }
        },

        posts (parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },

        comments (parent, args, ctx, info) {
            if (!args.query) {
                return comments
            }

            return comments.filter((comment) => {
                return comment.text.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.email)
            if ( emailTaken ) throw new Error('Email taken')
            const user = {
                id: uuidv4(),
                ...args
            }

            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.author);
            if ( !userExists ) throw new Error('User does not exists');
            const post = {
                id: uuidv4(),
                ...args
            }

            posts.push(post)
            return post
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.author);
            const postExists = posts.find((post) => (post.id === args.post && post.published));
            if ( !userExists ) throw new Error('User does not exists');
            if ( !postExists ) throw new Error('Post does not exists');
            const comment = { 
                id: uuidv4(), 
                ...args 
            }

            comments.push(comment)
            return comment
        }
    },
    Post: {
        author (parent, args, ctx, info) {
            return users.find((user)=> {
                return user.id === parent.author
            })
        },
        comments (parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    User: {
        posts (parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments (parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.post
            })
        }
        
    },
    Comment: {
        author (parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post (parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log("Server is running.")
})