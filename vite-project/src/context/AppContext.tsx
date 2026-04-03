import { createContext, useState, useEffect, useContext } from "react";
import {
  type UserData as User,
  type FoodEntry,
  type ActivityEntry,
  type Credentials,
} from "../types";
import { useNavigate } from "react-router-dom";
import api from "../configs/api";
import { toast } from "react-hot-toast";

interface AppContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserFetched: boolean;
  fetchUser: (token: string) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  OnboardingCompleted: boolean;
  setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  allFoodLogs: FoodEntry[];
  allActivityLogs: ActivityEntry[];
  addFoodLog: (
    entry: Omit<FoodEntry, "id" | "documentId" | "createdAt">,
  ) => Promise<void>;
  deleteFoodLog: (id: string) => Promise<void>;
  addActivityLog: (
    entry: Omit<ActivityEntry, "id" | "documentId" | "createdAt">,
  ) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [OnboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  // Helper: Checks if user has filled profile info (Age, Weight, Goal)
  const checkOnboarding = (userData: any) => {
    if (userData?.age && userData?.weight && userData?.goal) {
      setOnboardingCompleted(true);
    }
  };

  // --- Auth Section ---
  const signup = async (credentials: Credentials) => {
    try {
      const { data } = await api.post("/api/auth/local/register", credentials);
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;

      setUser({ ...data.user, token: data.jwt });
      checkOnboarding(data.user);
      toast.success("Registration Successful!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message || "Registration failed",
      );
    }
  };

  const login = async (credentials: Credentials) => {
    try {
      const { data } = await api.post("/api/auth/local", {
        identifier: credentials.email,
        password: credentials.password,
      });

      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;

      setUser({ ...data.user, token: data.jwt });
      checkOnboarding(data.user);

      // Load user data immediately
      await Promise.all([fetchFoodLogs(), fetchActivityLogs()]);
      toast.success("Welcome back!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error?.message || "Invalid Credentials",
      );
    }
  };

  const fetchUser = async (token: string) => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await api.get("/api/users/me");
      setUser({ ...data, token });
      checkOnboarding(data);
    } catch (error) {
      logout(); // Token expired or invalid
    } finally {
      setIsUserFetched(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setOnboardingCompleted(false);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    navigate("/");
  };

  // --- Data Fetching ---
  const fetchFoodLogs = async () => {
    try {
      const { data } = await api.get("/api/food-logs");
      // Mapping for Strapi v4/v5 data structure
      setAllFoodLogs(data.data || data);
    } catch (error) {
      console.error("Fetch Food Error:", error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data } = await api.get("/api/activity-logs");
      setAllActivityLogs(data.data || data);
    } catch (error) {
      console.error("Fetch Activity Error:", error);
    }
  };

  // --- CRUD Operations ---
  const addFoodLog = async (entry: any) => {
    try {
      const payload = { data: { ...entry, publishedAt: new Date() } };
      const { data } = await api.post("/api/food-logs", payload);
      setAllFoodLogs((prev) => [data.data || data, ...prev]);
      toast.success("Food Logged");
    } catch (error) {
      toast.error("Failed to add food");
    }
  };

  const addActivityLog = async (entry: any) => {
    try {
      const payload = { data: { ...entry, publishedAt: new Date() } };
      const { data } = await api.post("/api/activity-logs", payload);
      setAllActivityLogs((prev) => [data.data || data, ...prev]);
      toast.success("Activity Logged");
    } catch (error) {
      toast.error("Failed to add activity");
    }
  };

  const deleteFoodLog = async (id: string) => {
    try {
      await api.delete(`/api/food-logs/${id}`);
      setAllFoodLogs((prev) => prev.filter((item: any) => item.id !== id));
      toast.success("Entry Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token).then(() => {
        fetchFoodLogs();
        fetchActivityLogs();
      });
    } else {
      setIsUserFetched(true);
    }
  }, []);

  const value: AppContextType = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    OnboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    allActivityLogs,
    addFoodLog,
    deleteFoodLog,
    addActivityLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
