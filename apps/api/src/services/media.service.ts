import { cloudinaryclient } from '@/cloudinary';
import { cloudinaryPublicIdFromURL } from '@/helpers/cloudinary-public-id-from-url';
import { UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';

type Media_Folder =
  | 'minpro-event-ticketing/payment'
  | 'minpro-event-ticketing/profile'
  | 'minpro-event-ticketing/event/asset'
  | 'minpro-event-ticketing/event/banner';

export class MediaService {
  upload = async (param: {
    file: Buffer;
    folder: Media_Folder;
    options?: UploadApiOptions;
  }) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinaryclient.uploader.upload_stream(
        {
          ...param.options,
          folder: param.folder,
          allowed_formats: ['jpg', 'png'],
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result!.secure_url);
        },
      );

      // Convert the buffer to a readable stream and pipe it to the upload stream
      const readableStream = new Readable();
      readableStream.push(param.file);
      readableStream.push(null); // Signal end of stream
      readableStream.pipe(uploadStream);
    });
  };

  uploadEventBanner = async (file: Buffer) => {
    return await this.upload({
      file,
      folder: 'minpro-event-ticketing/event/banner',
    });
  };

  uploadProfilePicture = async (file: Buffer) => {
    return await this.upload({
      file,
      folder: 'minpro-event-ticketing/profile',
    });
  };

  uploadPaymentProof = async (file: Buffer) => {
    return await this.upload({
      file,
      folder: 'minpro-event-ticketing/payment',
    });
  };

  uploadEventAsset = async (file: Buffer) => {
    return await this.upload({
      file,
      folder: 'minpro-event-ticketing/event/asset',
    });
  };

  remove = async (url: string) => {
    const publicId = cloudinaryPublicIdFromURL(url);
    if (!publicId) return null;
    return await cloudinaryclient.uploader.destroy(publicId);
  };
}
