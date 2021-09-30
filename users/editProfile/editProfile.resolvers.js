import { createWriteStream } from 'fs';
import client from '../../client';
import bcrpyt from 'bcrypt';
import { protectResolver } from '../users.utils';

const resolverFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let avatarUrl = null;

  if (avatar) {
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const wirteStream = createWriteStream(process.cwd() + '/uploads/' + newFilename);

    readStream.pipe(wirteStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
    console.log(avatarUrl);
  }

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
      ...(avatarUrl && { avatar: avatarUrl }),
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
