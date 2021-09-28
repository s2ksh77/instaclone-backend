import client from "../../client";
import bcrpyt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword, token }
    ) => {
      const { id } = await jwt.verify(token, process.env.SECRET_KEY);
      let uglyPassword = null;
      if (newPassword) {
        uglyPassword = await bcrpyt.hash(newPassword, 10); // hash password
      }
      const updatedUser = await client.user.update({
        where: { id },
        data: {
          firstName,
          lastName,
          username,
          email,
          ...(uglyPassword && { password: uglyPassword }),
        },
      });
      if (updatedUser.id) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "Could not update profile.",
        };
      }
    },
  },
};
