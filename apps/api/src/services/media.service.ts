import { cloudinaryclient } from '@/cloudinary';
import { UploadApiOptions } from 'cloudinary';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';

type Media_Folder =
  | 'minpro-event-ticketing/profile/'
  | 'minpro-event-ticketing/asset'
  | 'minpro-event-ticketing/event/banner'
  | 'minpro-event-ticketing/temp/banner';

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

  uploadBannerTemp = async (file: Buffer, fixedId: string) => {
    return await this.upload({
      file,
      folder: 'minpro-event-ticketing/temp/banner',
      options: {
        public_id: fixedId,
        unique_filename: false,
        overwrite: true,
      },
    });
  };

  uploadAsset = async (file: Buffer) => {
    return await this.upload({
      file,
      folder: 'minpro-event-ticketing/asset',
      options: {
        unique_filename: true,
        overwrite: false,
      },
    });
  };

  rename = async (src: string, target: string) => {
    target = target + '/' + uuid();
    const result = await cloudinaryclient.uploader.rename(src, target, {
      invalidate: true,
      overwrite: true,
    });
    return result.secure_url as string;
  };
}
