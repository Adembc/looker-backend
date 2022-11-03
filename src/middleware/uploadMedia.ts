import multer from "multer";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
const uploadMedia = (folder: string, fieldName: string = "") => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
  });
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
      //@ts-ignore
      resource_type: "auto",
      //@ts-ignore
      folder,
    },
  });
  const upload = multer({ storage });
  if (!fieldName) return upload.any();
  return upload.single(fieldName);
};
export default uploadMedia;
