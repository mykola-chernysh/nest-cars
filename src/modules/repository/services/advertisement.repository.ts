import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { AdvertisementListRequestDto } from '../../advertisement/models/dto/request/advertisement-list.request.dto';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';

@Injectable()
export class AdvertisementRepository extends Repository<AdvertisementEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdvertisementEntity, dataSource.manager);
  }

  public async getAll(query: AdvertisementListRequestDto): Promise<[AdvertisementEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement');
    qb.leftJoinAndSelect('advertisement.user', 'user');

    qb.addOrderBy('advertisement.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getMyAllAd(
    query: AdvertisementListRequestDto,
    userData: IUserData,
  ): Promise<[AdvertisementEntity[], number]> {
    const qb = this.createQueryBuilder('advertisement');
    qb.leftJoinAndSelect('advertisement.user', 'user');

    qb.andWhere('advertisement.user_id = :myId');
    qb.setParameter('myId', userData.userId);

    qb.addOrderBy('advertisement.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getMyAd(myAdId: string, userData: IUserData): Promise<AdvertisementEntity> {
    const qb = this.createQueryBuilder('advertisement');
    qb.leftJoinAndSelect('advertisement.user', 'user');

    qb.where('advertisement.id = :myAdId', { myAdId });
    qb.andWhere('advertisement.user_id = :myId', { myId: userData.userId });

    return await qb.getOne();
  }
}
