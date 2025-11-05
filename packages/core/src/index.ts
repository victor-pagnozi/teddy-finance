export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  salary: number;
  company: number;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
