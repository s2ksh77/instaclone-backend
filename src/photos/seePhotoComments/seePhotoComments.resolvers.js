import client from '../../client';

export default {
  Query: {
    seePhotoComments: async (_, { id }) =>
      await client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          user: true,
          photo: true,
        },
      }),
  },
};
