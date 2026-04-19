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
  fetchUser: (token: string) => Promise<any>;
  signup: (credentials: Credentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  OnboardingCompleted: boolean;
  setOnboardingCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  allFoodLogs: FoodEntry[];
  allActivityLogs: ActivityEntry[];
  setAllActivityLogs: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
  addFoodLog: (entry: any) => Promise<void>;
  deleteFoodLog: (id: string | number) => Promise<void>;
  addActivityLog: (entry: any) => Promise<void>;
  deleteActivityLog: (id: string | number) => Promise<void>; // Added for completeness
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
      navigate("/");
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
      await Promise.all([
        fetchFoodLogs(data.user.id),
        fetchActivityLogs(data.user.id),
      ]);
      toast.success("Welcome back!");
      navigate("/");
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
      return data;
    } catch (error) {
      logout(); // Token expired or invalid
    } finally {
      setIsUserFetched(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    // This wipes the React memory and takes them to the root page safely
    window.location.href = "/";
  };

  // --- Data Fetching ---
  const fetchFoodLogs = async (userId?: string | number) => {
    const id = userId || user?.id;
    if (!id) return;
    try {
      const { data } = await api.get(
        `/api/food-logs?populate=*&filters[users_permissions_user][id][$eq]=${id}`, // ✅
      );
      setAllFoodLogs(data.data || []);
    } catch (error) {
      console.error("Fetch Food Error:", error);
    }
  };

  const fetchActivityLogs = async (userId?: string | number) => {
    const id = userId || user?.id;
    if (!id) { return; }
    try {
      const { data } = await api.get(
        `/api/activity-logs?populate=*&filters[users_permissions_user][id][$eq]=${id}`,
      );
      setAllActivityLogs(data.data || []);
    } catch (error) {
      console.error("Fetch Activity Error:", error);
    }
  };
  const addFoodLog = async (entry: any) => {
    try {
      const payload = {
        data: {
          name: String(entry.name),
          calories: Number(entry.calories),
          mealType: entry.mealType,
          users_permissions_user: user?.id, // ✅
          publishedAt: new Date(),
        },
      };
      console.log("NEW PAYLOAD (no date):", payload);

      console.log("Sending Payload:", payload); // Debug: Check this in console

      const response = await api.post("/api/food-logs", payload);
      console.log("FULL RESPONSE:", response.data);
      console.log("RESPONSE DATA:", response.data?.data);

      if (response.data?.data) {
        const newEntry = response.data.data;
        setAllFoodLogs((prev) => [newEntry, ...prev]);
        toast.success("Food Logged! 🍎");
      }
    } catch (error: any) {
      const strapiMessage = error.response?.data?.error?.message;
      const validationDetails = error.response?.data?.error?.details?.errors;

      console.error("--- STRAPI ERROR DETAILS ---");
      console.error("Main Message:", strapiMessage);
      console.table(validationDetails); 

      toast.error(strapiMessage || "Failed to add food");
    }
  };

  const addActivityLog = async (entry: any) => {
    try {
      const payload = {
  data: {
    name: String(entry.name),
    duration: Number(entry.duration),
    calories: Number(entry.calories),
    users_permissions_user: user?.id,
    publishedAt: new Date(),
  },
};

    const response = await api.post("/api/activity-logs", payload);

    if (response.data?.data) {
      const newEntry = response.data.data; 
      setAllActivityLogs((prev) => [newEntry, ...prev]);

      toast.success("Activity Tracked! 🔥");
    }
  } catch (error: any) {
      console.error(
        "Activity Post Error:",
        error.response?.data || error.message,
      );
      toast.error("Failed to add activity. Check console.");
    }
  };


  const deleteFoodLog = async (id: string | number) => {
    try {
      // Strapi endpoint for deleting a specific entry
      await api.delete(`/api/food-logs/${id}`);

      // Update local state by filtering out the deleted ID
      setAllFoodLogs((prev) => prev.filter((item: any) => item.id !== id));

      toast.success("Food entry removed");
    } catch (error) {
      console.error("Delete Food Error:", error);
      toast.error("Failed to delete entry");
    }
  };

  const deleteActivityLog = async (id: string | number) => {
    try {
      await api.delete(`/api/activity-logs/${id}`);
      setAllActivityLogs((prev) => prev.filter((item) => item.id !== id));
      toast.success("Activity Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token).then((userData) => {
        if (userData?.id) {
          fetchFoodLogs(userData.id);
          fetchActivityLogs(userData.id);
        }
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
    setAllActivityLogs,
    addFoodLog,
    deleteFoodLog,
    addActivityLog,
    deleteActivityLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
