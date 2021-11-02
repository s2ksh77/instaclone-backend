import client from '../../client';
import { protectResolver } from '../../users/users.utils';

export default {
  Query: {
    seeFeed: protectResolver((_, { offset }, { loggedInUser }) =>
      client.photo.findMany({
        take: 2,
        skip: offset,
        where: {
          OR: [
            // 합친다
            {
              // 내가 팔로워한 유저들의 정보들
              user: {
                followers: {
                  some: {
                    id: loggedInUser.id,
                  },
                },
              },
            },
            {
              // 내가 올린 feed 들
              userId: loggedInUser.id,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    ),
  },
};
