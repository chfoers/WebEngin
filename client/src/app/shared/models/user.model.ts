export interface User {
  name: string,
  email: string,
  password: string,
  passwordConfirm?: string,
  oldPassword?: string,
}