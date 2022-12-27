import { OmitType } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class registerAuth extends OmitType(User, ['createdAt'] as const) {}
