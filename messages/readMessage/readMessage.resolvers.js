import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Mutation: {
    readMessage: protectResolver(async (_, { id }, { loggedInUser }) => {
      const message = await client.message.findFirst({
        where: {
          id, // message를 읽으라는 id가 왔고
          userId: {
            not: loggedInUser.id, // 내가 보낸 것이 아닌
          },
          room: {
            users: {
              some: {
                id: loggedInUser.id, // 로그인 된 나의 유저들의 방 ---> 내가 지금 들어와 있는 방
              },
            },
          },
        },
        select: {
          id: true,
        },
      });
      if (!message) {
        return {
          ok: false,
          error: "Message not found.",
        };
      }
      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      });
      return {
        ok: true,
      };
    }),
  },
};
