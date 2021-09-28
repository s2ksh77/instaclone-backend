import client from "../../client";
import bcrpyt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (_, { firstName, lastName, username, email, password }) => {
      try {
        // check if username or email are already on DB.
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
          throw new Error("This username/password is already taken.");
        }
        const uglyPassword = await bcrpyt.hash(password, 10); // hash password
        return client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        // save and return the user
      } catch (e) {
        return e;
      }
    },
  },
};
