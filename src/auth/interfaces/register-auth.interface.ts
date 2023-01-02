import { OmitType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class registerAuth extends OmitType(User, ['createdAt'] as const) {}
