import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Timer,
  Activity as ActivityIcon,
  Zap,
  X,
  Loader2,
} from "lucide-react";
import {toast} from "react-hot-toast";
import api from "../configs/api"; // Your Axios instance
import {useAppContext} from "../context/AppContext";

const ActivityLog = () => {
  const {
    allActivityLogs,
    setAllActivityLogs,
    addActivityLog,
    deleteActivityLog,
  } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    calories: "",
  });
  const quickAddItems = [
    { name: "Walking", emoji: "🚶", defaultCal: 150 },
    { name: "Running", emoji: "🏃", defaultCal: 300 },
    { name: "Cycling", emoji: "🚴", defaultCal: 250 },
    { name: "Weight Training", emoji: "🏋️", defaultCal: 200 },
    { name: "Yoga", emoji: "🧘", defaultCal: 120 },
  ];

  const totalMinutes = allActivityLogs.reduce(
    (acc, curr) => acc + (Number(curr?.duration) || 0),
    0,
  );

  // --- API LOGIC ---
  
  const handleQuickAdd = async (item: (typeof quickAddItems)[0]) => {
    const toastId = toast.loading(`Logging ${item.name}...`);
    try {
      
      await addActivityLog({
        name: item.name,
        duration: 30,
        calories: item.defaultCal,
      });

      toast.success(`${item.name} logged!`, { id: toastId });
    } catch (err) {
      toast.error("Failed to log activity", { id: toastId });
    }
  };

  const handleManualSave = async () => {
    if (!formData.name || !formData.duration || !formData.calories) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addActivityLog({
        name: formData.name,
        duration: formData.duration,
        calories: formData.calories,
      });
      setIsAdding(false);
      setFormData({ name: "", duration: "", calories: "" });
      toast.success("Workout saved! 💪");
    } catch (err) {
      toast.error("Save failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteActivity = async (id: number) => {
    await deleteActivityLog(id); // Use the context version!
  };

  return (
    <div className="min-h-screen bg-[#0B1221] p-4 md:p-8 text-white">
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Activity Log</h1>
          <p className="text-slate-400 font-medium mt-1">
            Track your progress at NIT Jamshedpur
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Active Today
          </p>
          <p className="text-3xl font-black text-emerald-400">
            {totalMinutes} min
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- LEFT: QUICK ADD --- */}
        <section className="bg-[#111827] border border-slate-800 p-8 rounded-[40px] shadow-xl h-fit">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Quick Add <Zap size={18} className="text-yellow-400" />
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {quickAddItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleQuickAdd(item)}
                className="bg-slate-800/40 hover:bg-slate-700 border border-slate-700/50 py-3 px-4 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{item.emoji}</span> {item.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-[#0B1221] py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={20} /> Add Custom Activity
          </button>
        </section>

        {/* --- RIGHT: LIST --- */}
        <section className="bg-[#111827] border border-slate-800 p-8 rounded-[40px] shadow-xl flex flex-col min-h-[400px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400">
              <ActivityIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Today's Sessions</h3>
              <p className="text-slate-500 text-sm font-medium">
                {allActivityLogs.length} logged
              </p>
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <AnimatePresence mode="popLayout">
              {allActivityLogs.map((activity: any) => (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-800/20 border border-slate-800/50 p-5 rounded-3xl flex justify-between items-center group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-900 p-3 rounded-2xl text-emerald-400">
                      <Timer size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white">
                        {activity.attributes?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(
                          activity.attributes?.createdAt,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-black text-white">
                        {activity.attributes?.duration} min
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">
                        {activity.attributes?.calories} kcal
                      </p>
                    </div>
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* --- MANUAL ADD MODAL --- */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-[#0B1221]/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111827] border border-slate-800 p-8 rounded-[40px] w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white">New Activity</h2>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Activity Name (e.g. 100 Squats)"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-emerald-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Minutes"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-emerald-500"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Calories"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-emerald-500"
                    value={formData.calories}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calories: e.target.value,
                      })
                    }
                  />
                </div>
                <button
                  onClick={handleManualSave}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-500 text-[#0B1221] rounded-2xl font-black shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Session"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};;

export default ActivityLog;
