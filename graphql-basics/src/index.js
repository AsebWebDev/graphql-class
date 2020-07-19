import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int]!
        me: User!
        post: Post!
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
        pubslished: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            return (args.name) ? `Hello, ${args.name}!`: `Hello!`
        },

        add (parent, args, ctx, info) {
            if (args.numbers.length === 0) {
                return 0
            }

            return args.numbers.reduce((arc, val) => arc +val )
        },

        grades(parent, args, ctx, info) {
            return [99,80,93]
        },

        me () {
            return {
                id: "122323",
                name: "Andre",
                email: "a.sebastian@test.de"
            }
        },

        post () {
            return {
                id: "87887",
                title: "My first post",
                body: "Very interesting post",
                pubslished: false
            }
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