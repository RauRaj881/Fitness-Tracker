import { createContext, useState, useEffect, useContext } from "react";
import {
  type UserData as User,
  type FoodEntry,
  type ActivityEntry,
  type Credentials,
} from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";
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
  // Methods
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

  // --- Auth & Initial Fetching ---
  const signup = async (credentials: Credentials) => {
    const { data } = await mockApi.auth.register(credentials);
    setUser(data.user);
    if (data?.user?.age && data?.user?.weight && data?.user?.goal)
      setOnboardingCompleted(true);
    localStorage.setItem("token", data.jwt);
  };

  const login = async (credentials: Credentials) => {
    const { data } = await mockApi.auth.login(credentials);
    setUser({ ...data.user, token: data.jwt });
    if (data?.user?.age && data?.user?.weight && data?.user?.goal)
      setOnboardingCompleted(true);
    localStorage.setItem("token", data.jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOnboardingCompleted(false);
    navigate("/");
  };

  const fetchUser = async (token: string) => {
    const { data } = await mockApi.user.me();
    setUser({ ...data, token });
    if (data?.age && data?.weight && data?.goal) setOnboardingCompleted(true);
    setIsUserFetched(true);
  };

  const fetchFoodLogs = async () => {
    const { data } = await mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };

  const fetchActivityLogs = async () => {
    const { data } = await mockApi.activityLogs.list();
    setAllActivityLogs(data);
  };

  // --- Food & Activity Operations ---

  const addFoodLog = async (
    entry: Omit<FoodEntry, "id" | "documentId" | "createdAt">,
  ) => {
    try {
      const { data } = await mockApi.foodLogs.create({ data: entry });
      setAllFoodLogs((prev) => [data, ...prev]);
    } catch (error) {
      toast.error("Failed to add food");
      throw error;
    }
  };

  const deleteFoodLog = async (id: string) => {
    try {
      await mockApi.foodLogs.delete(id);
      setAllFoodLogs((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const addActivityLog = async (
    entry: Omit<ActivityEntry, "id" | "documentId" | "createdAt">,
  ) => {
    try {
      const { data } = await mockApi.activityLogs.create({ data: entry });
      setAllActivityLogs((prev) => [data, ...prev]);
    } catch (error) {
      toast.error("Failed to add activity");
      throw error;
    }
  };

  // Initial Load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          await fetchUser(token);
          await fetchFoodLogs();
          await fetchActivityLogs();
        } catch (error) {
          setIsUserFetched(true);
        }
      })();
    } else {
      setIsUserFetched(true);
    }
  }, []);

  // Ensure this object matches AppContextType exactly
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
    addActivityLog, // <--- Fixed: This was likely missing from your value object
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};
