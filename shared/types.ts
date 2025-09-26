export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Item {
  id: string;
  name: string;
  quantity: number;
}
export interface Bin {
  id: string;
  name: string;
  description: string;
  items: Item[];
  createdAt: number;
  updatedAt: number;
}
export interface SearchResult {
  itemId: string;
  itemName: string;
  itemQuantity: number;
  binId: string;
  binName: string;
}