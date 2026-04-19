import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import api from "../configs/api";
import {
  Plus,
  Trash2,
  Coffee,
  Moon,
  Sun,
  Utensils,
  Search,
  Zap,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FoodEntry } from "../types";
import { toast } from "react-hot-toast";

const FoodLog = () => {
  const { allFoodLogs, user, addFoodLog, deleteFoodLog } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    calories: "" as string|number,
    mealType: "breakfast" as FoodEntry["mealType"],
  });

  // --- 1. FIXED STATS CALCULATION ---
  const stats = useMemo(() => {
    const totalConsumed = allFoodLogs.reduce(
      (acc, log) =>
        acc + (Number((log as any).calories ?? log?.calories) || 0),
      0,
    );
    const dailyTarget = Number(user?.dailyCalorieIntake) || 2000;
    const remaining = dailyTarget - totalConsumed;
    const progress = Math.min((totalConsumed / dailyTarget) * 100, 100);

    return {
      totalConsumed,
      dailyTarget,
      remaining,
      progress,
      goalMode: user?.goal,
    };
  }, [allFoodLogs, user]);

  const categories = [
    {
      id: "breakfast",
      label: "Breakfast",
      icon: Coffee,
      color: "#FDBA74",
      bg: "rgba(253, 186, 116, 0.1)",
      emoji: "🌮",
    },
    {
      id: "lunch",
      label: "Lunch",
      icon: Sun,
      color: "#FACC15",
      bg: "rgba(250, 204, 21, 0.1)",
      emoji: "🍱",
    },
    {
      id: "dinner",
      label: "Dinner",
      icon: Moon,
      color: "#818CF8",
      bg: "rgba(129, 140, 248, 0.1)",
      emoji: "🌙",
    },
    {
      id: "snack",
      label: "Snack",
      icon: Utensils,
      color: "#F472B6",
      bg: "rgba(244, 114, 182, 0.1)",
      emoji: "🍪",
    },
  ] as const;

  const openAddModal = (
    type: FoodEntry["mealType"] = "breakfast",
  ) => {
    setFormData({ ...formData, mealType: type });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.calories) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    try {
      await addFoodLog({
        name: formData.name,
        calories: Number(formData.calories),
        mealType: formData.mealType,
        date: new Date().toISOString().split("T")[0],
      });
      setIsAdding(false);
      setFormData({ name: "", calories: "", mealType: "breakfast" });
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSaving(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const toastId = toast.loading("Analyzing image with AI...");
    
    try {
      const formDataObj = new FormData();
      formDataObj.append("image", file);

      const { data } = await api.post("/api/image-analysis", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success && data.result) {
        setFormData({
          name: data.result.name || "",
          calories: data.result.calories || "",
          mealType: formData.mealType || "breakfast"
        });
        setIsAdding(true);
        toast.success("Food scanned successfully!", { id: toastId });
      } else {
        throw new Error("Invalid scan result");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze image", { id: toastId });
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1221] p-4 md:p-8 text-slate-800 dark:text-slate-200 transition-colors">
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Food Log <span className="text-[#10B981] text-2xl">⚡</span>
            </h1>
            <div className="flex items-center gap-2 mt-2 text-slate-400 font-medium">
              <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-xs uppercase text-[#10B981]">
                <Target size={12} /> {stats.goalMode || "Active"}
              </span>
              <span>•</span>
              <span className="text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </motion.div>

          <div className="bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6 shadow-2xl transition-colors">
            <div className="text-center px-4 border-r border-slate-200 dark:border-slate-800 transition-colors">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Consumed
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {stats.totalConsumed}
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Remaining
              </p>
              <p
                className={`text-2xl font-black ${stats.remaining < 0 ? "text-red-400" : "text-[#10B981]"}`}
              >
                {Math.abs(stats.remaining)}
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/50 p-1 transition-colors">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            className={`h-full rounded-full ${stats.remaining < 0 ? "bg-red-500" : "bg-gradient-to-r from-[#10B981] to-[#34D399]"}`}
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#10B981]"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter your meals..."
              className="w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#10B981]/20 outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 transition-colors">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Quick Entry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => openAddModal(cat.id)}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:-translate-y-1"
                >
                  <span className="text-xl mb-1">{cat.emoji}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {cat.id}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => openAddModal()}
              className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0D9668] text-[#0B1221] py-4 rounded-2xl font-black transition-all shadow-xl shadow-[#10B981]/20"
            >
              <Plus size={20} strokeWidth={3} /> ADD FOOD
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Zap size={20} className={isScanning ? "animate-pulse" : ""} strokeWidth={3} /> 
              {isScanning ? "SCANNING..." : "AI SCAN"}
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </div>
        </aside>

        {/* --- 2. FIXED MEAL LOGS SECTION --- */}
        <main className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat, idx) => {
              const items = allFoodLogs.filter(
                (log) =>
                  log.mealType === cat.id && // Added .attributes
                  log.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()), // Added .attributes
              );
              const total = items.reduce(
                (sum, item) => sum + (item.calories || 0), // Added .attributes
                0,
              );

              return (
                <motion.section
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
                >
                  <div className="px-6 py-4 flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-2 rounded-xl"
                        style={{ backgroundColor: cat.bg }}
                      >
                        <cat.icon size={20} style={{ color: cat.color }} />
                      </div>
                      <h4 className="font-bold text-lg">{cat.label}</h4>
                    </div>
                    <p className="font-mono text-slate-400">{total} kcal</p>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50 transition-colors">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 flex justify-between items-center group hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                              Logged{" "}
                              {new Date(
                                item.createdAt || Date.now(),
                              ).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-5">
                            <span className="font-mono font-bold text-[#10B981]">
                              {item.calories}
                            </span>
                            <button
                              onClick={() => deleteFoodLog(item.id)}
                              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-600 text-sm italic">
                        Empty
                      </div>
                    )}
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        </main>
      </div>

      {/* --- ADD MODAL --- */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#0B1221]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] w-full max-w-md shadow-2xl transition-colors"
          >
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Log a Meal</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What did you eat?"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 outline-none focus:border-[#10B981]"
              />
              <input
                type="number"
                placeholder="Calories (kcal)"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: e.target.value })
                }
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 outline-none focus:border-[#10B981]"
              />
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData({ ...formData, mealType: e.target.value as any })
                }
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 outline-none focus:border-[#10B981] text-slate-400"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-[#10B981] text-[#0B1221] rounded-2xl font-black"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FoodLog;
