import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Timer,
  Activity as ActivityIcon,
  Zap,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Activity {
  id: string;
  name: string;
  duration: number;
  caloriesBurned: number;
  time: string;
}

const ActivityLog = () => {
  // --- STATE ---
  const [isAdding, setIsAdding] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      name: "Yoga",
      duration: 30,
      caloriesBurned: 120,
      time: "08:09 PM",
    },
    {
      id: "2",
      name: "Weight Training",
      duration: 30,
      caloriesBurned: 180,
      time: "08:09 PM",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    caloriesBurned: "",
  });

  // --- CONFIG ---
  const quickAddItems = [
    { name: "Walking", emoji: "🚶", defaultCal: 150 },
    { name: "Running", emoji: "🏃", defaultCal: 300 },
    { name: "Cycling", emoji: "🚴", defaultCal: 250 },
    { name: "Swimming", emoji: "🏊", defaultCal: 400 },
    { name: "Yoga", emoji: "🧘", defaultCal: 120 },
    { name: "Weight Training", emoji: "🏋️", defaultCal: 200 },
  ];

  // --- LOGIC ---
  const totalMinutes = activities.reduce((acc, curr) => acc + curr.duration, 0);

    const handleQuickAdd = (item: (typeof quickAddItems)[0]) => {
        const newEntry: Activity = {
            id: Date.now().toString(),
            name: item.name,
            duration: 30, // Default to 30 mins
            caloriesBurned: item.defaultCal,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        setActivities([newEntry, ...activities]);
        toast.success(`${item.name} added!`);
    };

  const handleManualSave = () => {
    if (!formData.name || !formData.duration || !formData.caloriesBurned) {
      toast.error("Please fill all required fields");
      return;
    }

    const newEntry: Activity = {
      id: Date.now().toString(),
      name: formData.name,
      duration: Number(formData.duration),
      caloriesBurned: Number(formData.caloriesBurned),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setActivities([newEntry, ...activities]);
    setFormData({ name: "", duration: "", caloriesBurned: "" });
    setIsAdding(false);
    toast.success("Activity logged! 🚀");
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((a) => a.id !== id));
    toast.error("Activity removed");
  };

  return (
    <div className="min-h-screen bg-[#0B1221] p-4 md:p-8 text-white">
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight">Activity Log</h1>
          <p className="text-slate-400 font-medium mt-1">Track your workouts</p>
        </motion.div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            Active Today
          </p>
          <p className="text-3xl font-black text-blue-400">
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
            className="w-full bg-[#10B981] hover:bg-[#0ea673] text-[#0B1221] py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#10B981]/10"
          >
            <Plus size={20} /> Add Custom Activity
          </button>
        </section>

        {/* --- RIGHT: LIST --- */}
        <section className="bg-[#111827] border border-slate-800 p-8 rounded-[40px] shadow-xl flex flex-col min-h-[400px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400">
              <ActivityIcon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Today's Activities</h3>
              <p className="text-slate-500 text-sm font-medium">
                {activities.length} logged
              </p>
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <AnimatePresence mode="popLayout">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-800/20 border border-slate-800/50 p-5 rounded-3xl flex justify-between items-center group hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-900 p-3 rounded-2xl text-blue-400">
                        <Timer size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{activity.name}</p>
                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-black text-white">
                          {activity.duration} min
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">
                          {activity.caloriesBurned} kcal
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
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 italic py-10">
                  <p>No activities logged today</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex justify-between items-center">
            <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">
              Total Active Time
            </span>
            <span className="text-xl font-black text-blue-400">
              {totalMinutes} minutes
            </span>
          </div>
        </section>
      </main>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-[#0B1221]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111827] border border-slate-800 p-8 rounded-[40px] w-full max-w-md shadow-2xl relative"
            >
              <h2 className="text-2xl font-black mb-6 text-white">
                New Activity
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-400 mb-2 block">
                    Activity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Morning Run"
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-[#10B981] text-white"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-400 mb-2 block">
                      Duration (min) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-[#10B981] text-white"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 mb-2 block">
                      Calories Burned <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 outline-none focus:border-[#10B981] text-white"
                      value={formData.caloriesBurned}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          caloriesBurned: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleManualSave}
                    className="flex-1 py-4 bg-[#10B981] text-[#0B1221] rounded-2xl font-black shadow-lg shadow-[#10B981]/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityLog;
