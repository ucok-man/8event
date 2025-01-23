import { CreateEventDto } from '@/dto/create-event.dto';
import { prismaclient } from '@/prisma';
import { EventCategory } from '@prisma/client';

export class EventService {
  async create(
    organizerId: string,
    event: Omit<CreateEventDto, 'categories' | 'tickets'>,
    categories?: EventCategory[],
  ) {
    return await prismaclient.event.create({
      data: {
        name: event.name,
        description: event.description,
        eventImage: event.eventImage,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        latitude: event.latitude,
        longitude: event.longitude,
        categories: {
          create: categories,
        },
        organizerId: organizerId, //
      },
    });
  }
}
