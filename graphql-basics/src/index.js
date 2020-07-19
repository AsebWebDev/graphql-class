import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const typeDefs = `
    type Query {
        hello: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        hello () {
            return 'This is my first query!'
        }
    }
}