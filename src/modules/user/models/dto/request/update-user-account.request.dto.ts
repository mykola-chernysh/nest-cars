import { PickType } from '@nestjs/swagger';

import { BaseUserRequestDto } from './base-user.request.dto';

export class UpdateUserAccountRequestDto extends PickType(BaseUserRequestDto, ['account']) {}
