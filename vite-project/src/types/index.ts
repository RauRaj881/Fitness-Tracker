// src/types/index.ts

export interface UserData {
  id: number;
  username: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: "lose" | "maintain" | "gain";
  dailyCalorieIntake: number;
  dailyCalorieBurn: number;
  createdAt: string;
}

export interface FoodEntry {
  id: number;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  date?: string;
  createdAt?: string;
}

export interface ActivityEntry {
  id: number;
  name: string;
  duration: number;
  caloriesBurned: number;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Credentials {
  email: string;
  password: string;
  username ?: string;
}
export type ProfileFormData = {
  age: number;
  weight: number;
  height: number;
  goal: "lose" | "maintain" | "gain";
  dailyCalorieIntake: number;
  dailyCalorieBurn: number;
};

// Re-export the constants from assets.ts
export * from "./assets";
