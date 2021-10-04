import client from "../client";

export default {
  User: {
    totalFollowing: ({ id }) => client.user.count({ where: { followers: { some: id } } }),
    totalFollwers: ({ id }) => client.user.count({ where: { following: { some: id } } }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      return id === loggedInUser.id;
    },
    isFollowing: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return false;
      // const exists = client.user
      //   .findUnique({ where: { username: loggedInUser.username } })
      //   .following({
      //     where: {
      //       id,
      //     },
      //   });
      // return exists.length !== 0;
      const exists = client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
  },
};
