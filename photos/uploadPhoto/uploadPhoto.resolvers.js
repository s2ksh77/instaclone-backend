import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectResolver(async (_, { file, caption }, { loggedInUser }) => {
      let hashtagObjs = null;
      if (caption) {
        // parse caption in hashtag
        const hashtags = caption.match(/#[\d|A-Z|a-z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g);
        hashtagObjs = hashtags.map((hashtag) => ({
          where: { hashtag },
          create: { hashtag },
        }));
      }
      return client.photo.create({
        data: {
          file,
          caption,
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          ...(hashtagObjs.length > 0 && {
            hashtags: {
              connectOrCreate: hashtagObjs,
            },
          }),
        },
      });
      // get or create Hashtags
      // save the photo with the parsed hashtags
      // add tho photo to the hashtags
    }),
  },
};
