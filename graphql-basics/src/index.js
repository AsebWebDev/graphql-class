import { GraphQLServer } from 'graphql-yoga'

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

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID! 
        title: String!
        body: String!
        published: Boolean!
        author: User!
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
        }
    },
    Post: {
        author (parent, args, ctx, info) {
            return users.find((user)=> {
                return user.id === parent.author
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