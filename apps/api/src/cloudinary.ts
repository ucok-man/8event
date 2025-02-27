const { v2: cloudinary } = require(require.resolve('cloudinary')); // wtf cloudinary??? resolving compiled version issue
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from './config';

cloudinary.config({
  secure: true,
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryclient = cloudinary;
``;
export { cloudinaryclient };
