const { ApolloServer, gql } = require('apollo-server-lambda')

const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')


const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Project = require('./resolvers/Project')
const Subscription = require('./resolvers/Subscription')

// The resolvers object is the actual implementation of the 
// GraphQL schema. its structure is identical to the structure of 
// the type definition inside typeDefs: Query.info
const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Project
}

// the schema and resolvers are bundled and passed to the GraphQLServer
// which is imported from graphql-yoga. This tells the server what 
// API operations are accepted and how they should be resolved
// const server = new GraphQLServer({
//   typeDefs: './src/schema.graphql',
//   resolvers,
//   context: request => {
//     return {
//       ...request,
//       prisma,
//     }
//   },
// })
// server.start(() => console.log(`Server is running on http://localhost:4000`))


const server = new ApolloServer({ 
  typeDefs: './src/schema.graphql',
  resolvers,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: true,
    credentials: true,
  },
});
