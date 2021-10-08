import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectResolver(async (_, { file, caption }, { loggedInUser }) => {
      let hashtagObjs = null;
      if (caption) {
        // parse caption in hashtag
        hashtagObjs = processHashtags(caption);
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
