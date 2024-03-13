import { EAccount } from '../../../../common/enums/account.enum';
import { ERole } from '../../../../common/enums/role.enum';

export type JwtPayload = {
  userId: string;
  userRole: ERole;
  userAccount: EAccount;
};
