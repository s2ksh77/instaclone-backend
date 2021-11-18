import client from '../../client';
import jwt from 'jsonwebtoken';
import bcrpyt from 'bcrypt';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // find user with args username
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: 'User not found.',
        };
      }
      const passwordOk = await bcrpyt.compare(password, user.password);
      // check password with args.password
      if (!passwordOk) {
        return {
          ok: false,
          error: 'Incorrect Password.',
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      };
      // issue a token and send it to the user
    },
  },
};
