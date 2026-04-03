import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
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
  // 1. Pulling functions from Context
  const { allFoodLogs, user, addFoodLog, deleteFoodLog } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // 2. Local state for the new meal form
  const [formData, setFormData] = useState({
    name: "",
    calories: "" as string | number,
    mealType: "breakfast" as FoodEntry["mealType"],
  });

  // 3. Stats Calculation
  const stats = useMemo(() => {
    const totalConsumed = allFoodLogs.reduce(
      (acc, log) => acc + (Number(log.calories) || 0),
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

  // --- Handlers ---

  const openAddModal = (type: FoodEntry["mealType"] = "breakfast") => {
    setFormData({ ...formData, mealType: type });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.calories) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addFoodLog({
        name: formData.name,
        calories: Number(formData.calories),
        mealType: formData.mealType,
        date: new Date().toISOString().split("T")[0],
      });
      setIsAdding(false);
      setFormData({ name: "", calories: "", mealType: "breakfast" });
      toast.success(`${formData.name} added!`);
    } catch (err) {
      // Error is handled by context toast
    }
  };

  const handleAiSnap = () => {
    toast.loading("Scanning plate...", { id: "ai-snap" });
    setTimeout(() => {
      toast.success("Detected: Greek Salad (~240 kcal)", { id: "ai-snap" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B1221] p-4 md:p-8 text-slate-200">
      {/* --- HERO SECTION --- */}
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
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

          <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800 flex items-center gap-6 shadow-2xl">
            <div className="text-center px-4 border-r border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase">
                Consumed
              </p>
              <p className="text-2xl font-black text-white">
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

        {/* Dynamic Progress Bar */}
        <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            className={`h-full rounded-full ${
              stats.remaining < 0
                ? "bg-red-500"
                : "bg-gradient-to-r from-[#10B981] to-[#34D399]"
            }`}
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- ACTIONS PANEL --- */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#10B981] transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter your meals..."
              className="w-full bg-[#111827] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#10B981]/20 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bg-[#111827] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Quick Entry
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => openAddModal(cat.id)}
                  className="flex flex-col items-center justify-center p-4 bg-slate-900/50 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-all hover:-translate-y-1"
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
              onClick={handleAiSnap}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold transition-all"
            >
              <Zap size={18} className="text-yellow-400 fill-yellow-400" /> AI
              SCAN
            </button>
          </div>
        </aside>

        {/* --- MEAL LOGS --- */}
        <main className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {categories.map((cat, idx) => {
              const items = allFoodLogs.filter(
                (log) =>
                  log.mealType === cat.id &&
                  log.name.toLowerCase().includes(searchQuery.toLowerCase()),
              );
              const total = items.reduce(
                (sum, item) => sum + (item.calories || 0),
                0,
              );

              return (
                <motion.section
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#111827] rounded-3xl border border-slate-800 overflow-hidden"
                >
                  <div className="px-6 py-4 flex justify-between items-center bg-slate-900/40">
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

                  <div className="divide-y divide-slate-800/50">
                    {items.length > 0 ? (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 flex justify-between items-center group hover:bg-white/[0.02]"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                              Logged{" "}
                              {new Date(
                                item.createdAt || Date.now(),
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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

      {/* --- ADD MODAL OVERLAY --- */}
      {isAdding && (
        <div className="fixed inset-0 bg-[#0B1221]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-[#111827] border border-slate-800 p-8 rounded-[40px] w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-black mb-6 text-white">Log a Meal</h2>
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
                  Save
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
