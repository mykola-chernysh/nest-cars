export class UserResponseDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  account?: string;
  blocked?: boolean;
  image?: string;
}
