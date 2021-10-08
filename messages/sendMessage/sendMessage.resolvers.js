import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        let room = null;
        if (userId) {
          // userId가 있으면 방이 없어 그러니 방을 만들고 내가 보낸걸 보내줘
          // 방을 만들때 '쟤'(userId)랑 '나'<- login한 아이디로 만들고
          // 새 방 id 에다가 어떤 유저 '나' 가 보냈어 라는 loggedInUser.id 넣음
          const user = await client.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
            },
          }); // user -> { id : 1 }
          if (!user) {
            return {
              ok: false,
              error: "This user does not exist.",
            };
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  {
                    id: loggedInUser.id,
                  },
                ],
              },
            },
          });
        } else if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          }); // room -> { id : 1 }
          if (!room) {
            return {
              ok: false,
              error: "Room not found.",
            };
          }
        }
        await client.message.create({
          data: {
            payload,
            room: {
              connect: {
                id: room.id,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};
