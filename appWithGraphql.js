import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {userResolver} from './resolver/userResolver.js';
import {userTypeDefs} from './graphql/user.js';

const port = 3000;
// const app = express();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: userTypeDefs,
  resolvers: userResolver,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: port },
  path: '/graphql',

});
console.log(`🚀  Server ready at: ${url}`);