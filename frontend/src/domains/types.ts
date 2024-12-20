export interface ApiResponse<T> {
    message: string;
    data: T;
  }
  
  export interface ApiError {
    message: string;
  }
  
  export interface ApiPaginatedResponse<T> extends ApiResponse<T> {
    count: number;
    page_count: number;
    page: number;
  }
  