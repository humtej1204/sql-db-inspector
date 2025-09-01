export interface ICommonBackendResponse<T = unknown> {
  success: boolean;
  kindMessage: string;
  data: T;
}
