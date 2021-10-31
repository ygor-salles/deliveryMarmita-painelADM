export default interface IAuthResponse {
  token?: string;
  refresh_token?: string;
  statusCode?: number,
  message?: string,
  error?: string,
}
