export interface ApiResponse<T> {
  isError: boolean;
  message: string;
  result: T;
}
