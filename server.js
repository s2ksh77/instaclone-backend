require('dotenv').config();
import { ApolloServer } from 'apollo-server';
import schema from './schema';
import { getUser, protectResolver } from './users/users.utils';

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectResolver,
    };
  },
});

const PORT = process.env.PORT;

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}/`));

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
