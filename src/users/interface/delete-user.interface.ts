import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class DeleteUser extends PickType(User, ['id'] as const) {}
