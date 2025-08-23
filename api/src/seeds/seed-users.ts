import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { Gender, Role } from 'src/user/user.enums';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const userService = appContext.get(UserService);

  const users = [
    {
      full_name: 'Super Admin',
      username: 'super_admin',
      email: 'super_admin@yopmail.com',
      password: '123123',
      employee_id: 'super_admin',
      employee_hik: 'super_admin',
      is_sync: 1,
      face_hik: '',
      role: Role.SUPER_ADMIN,
      position: 'super_admin',
      gender: Gender.MALE,
      birthday: new Date('1990-01-01'),
      phone: '123456789',
      address: '123 Main Street',
      avatar: '',
    },
  ];

  for (const user of users) {
    try {
      await userService.updateOrCreate(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  }

  await appContext.close();
}

bootstrap();
// npx ts-node -r tsconfig-paths/register src/seeds/seed-users.ts
