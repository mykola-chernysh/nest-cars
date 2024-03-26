import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ViewEntity } from '../../../database/entities/view.entity';

@Injectable()
export class ViewRepository extends Repository<ViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ViewEntity, dataSource.manager);
  }

  public async getViewsPerDay(adId: string): Promise<number> {
    const today = new Date();
    const qb = this.createQueryBuilder('views');

    qb.select('COUNT(*)', 'viewCount');
    qb.where('views.advertisement_id = :adId', { adId });
    qb.andWhere('DATE(views.created) = :today', { today });

    const views = await qb.getRawOne();

    return parseInt(views.viewCount);
  }

  public async getViewsPerWeek(adId: string): Promise<number> {
    const startDay = new Date();
    startDay.setDate(startDay.getDate());

    const endDay = new Date();
    endDay.setDate(startDay.getDate() - 6);

    const qb = this.createQueryBuilder('views');
    qb.select('COUNT(*)', 'viewCount');
    qb.where('views.advertisement_id = :adId', { adId });
    qb.andWhere('Date(views.created) <= :startDay AND Date(views.created) >= :endDay', {
      startDay: startDay,
      endDay: endDay,
    });

    const views = await qb.getRawOne();

    return parseInt(views.viewCount);
  }

  public async getViewsPerMonth(adId: string): Promise<number> {
    const startDay = new Date();
    startDay.setDate(startDay.getDate());

    const endDay = new Date();
    endDay.setDate(startDay.getDate() - 30);

    const qb = this.createQueryBuilder('views');
    qb.select('COUNT(*)', 'viewCount');
    qb.where('views.advertisement_id = :adId', { adId });
    qb.andWhere('Date(views.created) <= :startDay AND Date(views.created) >= :endDay', {
      startDay: startDay,
      endDay: endDay,
    });

    const views = await qb.getRawOne();

    return parseInt(views.viewCount);
  }
}
