import { cloudinaryclient } from '@/cloudinary';
import { Readable } from 'stream';

type Media_Folder =
  | 'minpro-event-ticketing/profile/'
  | 'minpro-event-ticketing/event/';

export class MediaService {
  async upload(param: {
    file: Buffer;
    folder: Media_Folder;
    id: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinaryclient.uploader.upload_stream(
        {
          public_id: `${param.id}`,
          folder: param.folder,
          allowed_formats: ['jpg', 'png', 'webp'],
          unique_filename: false,
          overwrite: true,
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
  }

  async uploadEventBanner(file: Buffer, id: string) {
    return this.upload({
      file,
      folder: 'minpro-event-ticketing/event/',
      id,
    });
  }

  async uploadProfilePic(file: Buffer, id: string) {
    return this.upload({
      file,
      folder: 'minpro-event-ticketing/profile/',
      id,
    });
  }
}
