import { SetMetadata } from '@nestjs/common';

import { SKIP_AUTH } from '../models/constants/constants';

export const SkipAuth = () => SetMetadata(SKIP_AUTH, true);
