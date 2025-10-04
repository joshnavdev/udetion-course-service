import { CourseScrapperPort } from '../../domain/services/courseScrapper.port';
import { CourseScrap } from '../../domain/dtos/courseScrap.dto';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { COURSE_SERVICE_PRODUCER, CREATE_COURSE_EVENT } from '../../domain/constants';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';

export class CourseScrapperAdapter implements CourseScrapperPort, OnModuleInit {
  private readonly logger = new Logger(CourseScrapperAdapter.name);

  constructor(@Inject(COURSE_SERVICE_PRODUCER) private readonly client: ClientKafka) {}

  async scrapeCourse(url: string): Promise<CourseScrap> {
    this.logger.log(`EVENT EMITTED: ${CREATE_COURSE_EVENT}`);

    return firstValueFrom(
      this.client.send<CourseScrap>(CREATE_COURSE_EVENT, { url }).pipe(
        catchError((err) => {
          this.logger.error(err);
          throw new Error('Error scraping course');
        }),
      ),
    );
  }

  onModuleInit() {
    this.client.subscribeToResponseOf(CREATE_COURSE_EVENT);
  }
}
