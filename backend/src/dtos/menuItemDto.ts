export interface MenuItemResponseDto {
  id: number;
  stallId: number;
  stallName: string; // hasil JOIN ke STALLS
  name: string;
  price: number;
  isAvailable: boolean;
}
