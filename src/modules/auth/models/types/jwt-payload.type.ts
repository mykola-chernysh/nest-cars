import { ERole } from '../../../../common/enums/role.enum';

export type JwtPayload = {
  userId: string;
  userRole: ERole;
};
