import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  name: string;
  email: string;

  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
