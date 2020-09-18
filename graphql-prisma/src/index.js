import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db';
import Query from './Resolvers/Query'
import Mutation from './Resolvers/Mutation'
import User from './Resolvers/User'
import Post from './Resolvers/Post'
import Comment from './Resolvers/Comment'
import Subscription from './Resolvers/Subscription'
import prisma from './prisma.js'

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers : { Query, Mutation, User, Post, Comment, Subscription },
    context: { db, pubsub, prisma }
})

server.start(() => { console.log('The server is up!') })