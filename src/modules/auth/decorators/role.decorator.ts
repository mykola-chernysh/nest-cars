import { SetMetadata } from '@nestjs/common';

import { ERole } from '../../../database/entities/enums/role.enum';

export const ROLES_KEY = 'role';
export const Roles = (...role: ERole[]) => SetMetadata(ROLES_KEY, role);
