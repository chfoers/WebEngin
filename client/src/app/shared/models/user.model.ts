// Modell, welches die Daten für die Registrierung enthält
export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
  password2?: string;
}
