import client from "../client";

export default {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
  },
  Hashtag: {
    photos: ({ id }, { page }, { loggedInUser }) => {
      return client.hashtag.findUnique({ where: { id } }).photos();
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        }, // photo 안에서 카운트를 세는데 hashtag id가 저거인 것
      }),
  },
};
