require('dotenv').config();
import http from 'http';
import express from 'express';
import logger from 'morgan';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';
import { getUser } from './users/users.utils';
import pubsub from './pubsub';

const PORT = process.env.PORT;

const apollo = new ApolloServer({
  resolvers,
  typeDefs,
  playground: true,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  },
});

const app = express();
app.use(logger('tiny'));
apollo.applyMiddleware({ app });
app.use(express.static('uploads'));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}/`);
});

// function 에서 function return
// es6
// const x = (resolver) => (root, args, context, info) => {
//   if (!context.loggedInUser) {
//     return {
//       ok: false,
//       eror: 'You login please',
//     };
//   }
//   return resolver(root, args, context, info);
// };

// es5
// function x(resolver) {
//   return function (root, args, context, info) {
//     if (!context.loggedInUser) {
//       return {
//         ok: false,
//         eror: 'You login please',
//       };
//     }
//   };
// }
