import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarEntity } from '../../../database/entities/car.entity';
import { AdvertisementListRequestDto } from '../../advertisement/modules/dto/request/advertisement-list.request.dto';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';

@Injectable()
export class AdvertisementRepository extends Repository<CarEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarEntity, dataSource.manager);
  }

  public async getAll(query: AdvertisementListRequestDto): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement');
    qb.leftJoinAndSelect('advertisement.user', 'user');

    qb.addOrderBy('advertisement.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getMyAllAd(query: AdvertisementListRequestDto, userData: IUserData): Promise<[CarEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement');
    qb.leftJoinAndSelect('advertisement.user', 'user');

    qb.andWhere('user_id = :myId');
    qb.setParameter('myId', userData.userId);

    qb.addOrderBy('advertisement.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getMyAd(myAdId: string, userData: IUserData): Promise<CarEntity> {
    const qb = this.createQueryBuilder('advertisement');
    qb.leftJoinAndSelect('advertisement.user', 'user');

    qb.where('advertisement.id = :myAdId', { myAdId });
    qb.andWhere('user_id = :myId');
    qb.setParameter('myId', userData.userId);

    return await qb.getOne();
  }
}
