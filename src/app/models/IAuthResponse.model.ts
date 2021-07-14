export default interface IAuthResponse {
  data: {
    user: {
      id: number;
      name: string;
      username: string;
      email: string;
      password?: string;
      role: string;
      createdAt: Date;
      updatedAt: Date
    };
    token: string;
    refresh_token?: string;
  }
}
