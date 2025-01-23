import { CreateEventDto } from '@/dto/create-event.dto';
import { prismaclient } from '@/prisma';

export class EventCategoryService {
  async createManyIfNotExist(
    categories: Pick<CreateEventDto, 'categories'>['categories'],
  ) {
    const result = await Promise.all(
      categories.map((category) => {
        return prismaclient.eventCategory.upsert({
          create: {
            name: category.name,
          },
          where: {
            name: category.name,
          },
          update: {}, // if found do nothing
        });
      }),
    );
    return result;
  }
}
