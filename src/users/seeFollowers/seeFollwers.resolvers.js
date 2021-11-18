import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found.",
        };
      }
      const followers = await client.user.findUnique({ where: { username } }).followers({
        take: 5,
        skip: (page - 1) * 5,
      });
      const totalFollwers = await client.user.count({
        where: { following: { some: username } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollwers / 5),
      };
    },
  },
};

// 찾고자 하는 user의 이름으로 following에 있는 username과 부합하는 결과 리턴

// const bFollowers = await client.user.findMany({
//   where: {
//     following: {
//       some: {
//         username,
//       },
//     },
//   },
// });
