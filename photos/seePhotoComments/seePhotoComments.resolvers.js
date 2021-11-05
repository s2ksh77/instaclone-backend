import client from '../../client';

export default {
  Query: {
    seePhotoComments: (_, { id }) =>
      client.comment.findMany({
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
