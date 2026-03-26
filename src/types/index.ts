// src/types/index.ts

export interface UserData {
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
  id: string;
  documentId: string;
  name: string;
  calories: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  createdAt: string;
}

export interface ActivityEntry {
  id: number;
  documentId: string;
  name: string;
  duration: number;
  calories: number;
  date: string;
  createdAt: string;
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
