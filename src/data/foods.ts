import foodsData from './foods.json';

export interface FoodItem {
  id: string;
  name: string;
  image: string;
  isHealthy: boolean;
}

// Convert the JSON data into our FoodItem format
export const foods: FoodItem[] = [
  ...foodsData.healthy.map((food, index) => ({
    id: `healthy-${index}`,
    ...food,
    isHealthy: true
  })),
  ...foodsData.unhealthy.map((food, index) => ({
    id: `unhealthy-${index}`,
    ...food,
    isHealthy: false
  }))
];