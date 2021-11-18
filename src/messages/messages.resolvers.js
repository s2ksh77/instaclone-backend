import client from "../client";

// seeRooms 나 seeRoom에 include로 users 를 가져와도 되지만
// message 자체에 Room 안에 users라는 걸 단다.. why.........?
export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }) => client.message.findMany({ where: { roomId: id } }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) return 0;
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
