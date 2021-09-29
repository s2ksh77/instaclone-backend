import client from '../../client';
import bcrpyt from 'bcrypt';
import { protectResolver } from '../users.utils';

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  const { filename, createReadStream } = await avatar;
  const stream = createReadStream();
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrpyt.hash(newPassword, 10); // hash password
  }
  const updatedUser = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      firstName,
      lastName,
      username,
      email,
      ...(uglyPassword && { password: uglyPassword }),
      bio,
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: 'Could not update profile.',
    };
  }
};

export default {
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
};
