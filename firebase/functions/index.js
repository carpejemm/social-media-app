require('dotenv').config();
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const axios = require("axios")


// const POSTS_API = "https://jsonplaceholder.typicode.com/posts";
// const UNSPLASH_API = "https://picsum.photos/300?random=2";

exports.fetchImagesAndTexts = onRequest({ cors: true }, async (req, res) => {
    try {
        const postResponse = await axios.get(process.env.POSTS_API);
        const posts = postResponse.data.slice(0, 10);
    
        const images = await Promise.all(
          posts.map(() => axios.get(process.env.UNSPLASH_API)) 
        );
    
        const imageUrls = images.map(image => image.request.res.responseUrl);
    
        const result = posts.map((post, index) => ({
          id: post.id,
          title: post.title,
          body: post.body,
          image: imageUrls[index],
        }));
    
        res.status(200).json(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
      }
  });