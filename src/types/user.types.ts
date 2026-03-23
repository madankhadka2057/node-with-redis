export interface CreateUserDto {
  email: string;
  name?: string | null;
  password: string;
  phone: string;
  addresse?: string | null;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
  phone: string;
  addresse?: string | null;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}
