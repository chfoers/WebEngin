export interface User {
  userId: string,
  name: string,
  email: string,
  password: string,
  password2?: string,
  oldPassword?: string,
}