import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Weight,
  Ruler,
  Target,
  Edit3,
  Save,
  LogOut,
  CheckCircle2,
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // 1. Load data from LocalStorage on start, or use defaults
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("user-stats");
    return saved
      ? JSON.parse(saved)
      : {
          age: 21,
          weight: 65,
          height: 180,
          goal: "Gain Muscle",
        };
  });

  // 2. Function to handle the Save button
  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem("user-stats", JSON.stringify(stats));

    // Show a "Saved" feedback message
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
    };
    const handleLogout = () => {
      // Clear the specific user data from localStorage
      localStorage.removeItem("user-stats");

      // If you have an auth token later, you'd clear it here:
      // localStorage.removeItem('token');

      // 2. Redirect to the login page
      // We use window.location.href for a full refresh to the login route
      window.location.href = "/login";
    };

  return (
    <div className="p-6 bg-[#0B1221] min-h-screen text-white font-sans">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
            {/* Success Toast Notification */}
            <AnimatePresence>
              {showSavedMessage && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute top-4 right-4 bg-emerald-500 text-[#0B1221] px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm z-50 shadow-lg"
                >
                  <CheckCircle2 size={16} /> Profile Updated!
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 mb-8">
              <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Your Profile
                </h2>
                <p className="text-slate-500 text-sm">
                  Managing your fitness goals
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <ProfileInput
                icon={<User size={18} />}
                label="Age"
                value={stats.age}
                isEditing={isEditing}
                onChange={(v) => setStats({ ...stats, age: v })}
              />
              <ProfileInput
                icon={<Weight size={18} />}
                label="Weight (kg)"
                value={stats.weight}
                isEditing={isEditing}
                onChange={(v) => setStats({ ...stats, weight: v })}
              />
              <ProfileInput
                icon={<Ruler size={18} />}
                label="Height (cm)"
                value={stats.height}
                isEditing={isEditing}
                onChange={(v) => setStats({ ...stats, height: v })}
              />

              <div className="flex items-center gap-4 bg-[#1F2937]/30 p-4 rounded-2xl border border-slate-800/50">
                <Target className="text-rose-500" size={18} />
                <div className="grow">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                    Current Goal
                  </p>
                  {isEditing ? (
                    <select
                      className="bg-[#111827] text-white font-bold outline-none w-full border border-slate-700 rounded-lg p-1"
                      value={stats.goal}
                      onChange={(e) =>
                        setStats({ ...stats, goal: e.target.value })
                      }
                    >
                      <option value="Gain Muscle">Gain Muscle</option>
                      <option value="Fat Loss">Fat Loss</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  ) : (
                    <p className="font-bold text-emerald-400">{stats.goal}</p>
                  )}
                </div>
              </div>
            </div>

            {/* THE DYNAMIC BUTTON */}
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`w-full mt-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 border shadow-lg ${
                isEditing
                  ? "bg-emerald-500 text-[#0B1221] border-emerald-400 hover:bg-emerald-400"
                  : "bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
              }`}
            >
              {isEditing ? (
                <>
                  <Save size={20} /> SAVE SETTINGS
                </>
              ) : (
                <>
                  <Edit3 size={20} /> EDIT PROFILE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-4">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-3xl">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500 mb-4">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0B1221] p-4 rounded-2xl border border-slate-800/50 text-center">
                <p className="text-2xl font-black text-emerald-500">0</p>
                <p className="text-[9px] text-slate-600 uppercase font-bold">
                  Foods
                </p>
              </div>
              <div className="bg-[#0B1221] p-4 rounded-2xl border border-slate-800/50 text-center">
                <p className="text-2xl font-black text-blue-500">2</p>
                <p className="text-[9px] text-slate-600 uppercase font-bold">
                  Workouts
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 text-red-500/80 rounded-2xl font-bold border border-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

// Fixed TypeScript Props for the Input Component
interface ProfileInputProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  isEditing: boolean;
  onChange: (v: string) => void;
}

const ProfileInput = ({
  icon,
  label,
  value,
  isEditing,
  onChange,
}: ProfileInputProps) => (
  <div className="flex items-center gap-4 bg-[#1F2937]/30 p-4 rounded-2xl border border-slate-800/50 transition-all hover:border-slate-700">
    <div className="text-blue-400">{icon}</div>
    <div className="grow">
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
        {label}
      </p>
      {isEditing ? (
        <input
          type="number"
          className="bg-[#0B1221] text-white font-bold outline-none border border-blue-500/50 rounded-lg px-2 py-1 w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <p className="font-bold text-lg">
          {value}{" "}
          <span className="text-sm font-medium text-slate-500">
            {label.includes("kg") ? "kg" : label.includes("cm") ? "cm" : "yrs"}
          </span>
        </p>
      )}
    </div>
  </div>
);

export default Profile;
