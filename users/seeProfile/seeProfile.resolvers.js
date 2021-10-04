import client from "../../client";

export default {
  Query: {
    seeProfile: (_, { username }) =>
      client.user.findUnique({
        where: { username },
        include: {
          // 유저에 관한 정보를 db로 다 불러올떄 1000명정도는 괜찮지만 100만명은 에바라 이방법은 놉!
          following: true,
          followers: true,
        },
      }),
  },
};
