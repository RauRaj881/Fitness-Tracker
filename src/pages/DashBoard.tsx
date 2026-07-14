import { useAppContext } from "../context/AppContext";
import {
  Flame,
  Activity,
  Dumbbell,
  Target,
  Ruler,
  User,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext();

  // Get today's date string
  const todayStr = new Date().toISOString().split("T")[0];

  // Calculations for TODAY
  const todayFoodLogs = allFoodLogs.filter(f => (f.date || (f.createdAt && f.createdAt.split("T")[0])) === todayStr);
  const todayActivityLogs = allActivityLogs.filter(a => (a.date || (a.createdAt && a.createdAt.split("T")[0])) === todayStr);

  const consumed = todayFoodLogs.reduce((sum, item) => sum + item.calories, 0);
  const burned = todayActivityLogs.reduce((sum, item) => sum + item.calories, 0);
  const activeMinutes = todayActivityLogs.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  const workouts = todayActivityLogs.length;

  // Use real user data or sensible defaults
  const weight = user?.weight || 75;
  const height = user?.height || 175;
  const calorieLimit = user?.dailyCalorieIntake || 3200;
  const calorieBurnGoal = user?.dailyCalorieBurn || 400;
  const bmi = Number((weight / (height / 100) ** 2).toFixed(1));

  // BMI color
  const bmiColor =
    bmi < 18.5
      ? "bg-red-500"
      : bmi <= 24.9
        ? "bg-emerald-500"
        : bmi <= 29.9
          ? "bg-yellow-400"
          : "bg-red-600";

  // Build this week's data from actual logs
  const today = new Date();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = weekDays[d.getDay()];

    const dayConsumed = allFoodLogs
      .filter((f) => (f.date || (f.createdAt && f.createdAt.split("T")[0])) === dateStr)
      .reduce((sum, f) => sum + f.calories, 0);

    const dayBurned = allActivityLogs
      .filter((a) => (a.date || (a.createdAt && a.createdAt.split("T")[0])) === dateStr)
      .reduce((sum, a) => sum + a.calories, 0);

    const dayActive = allActivityLogs
      .filter((a) => (a.date || (a.createdAt && a.createdAt.split("T")[0])) === dateStr)
      .reduce((sum, a) => sum + a.duration, 0);

    return { day: dayLabel, consumed: dayConsumed, burned: dayBurned, active: dayActive };
  });

  const bmiPercentage = Math.min((bmi / 30) * 100, 100);


  return (
    <div className="themed-page p-6">
      {/* Header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome Back</p>
        <h1 className="text-2xl font-bold mt-1">
          {`Hi there! 👋 ${user?.username || user?.name || "User"}`}
        </h1>

        {/* Motivation */}
        <div className="mt-4 bg-white/10 p-3 rounded-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          <span>Great workout today! Keep it up!</span>
        </div>
      </div>

      {/* Calories Card */}
      <div className="themed-card border border-[var(--border-color)] p-6 rounded-2xl mb-6 shadow-lg space-y-6">
        {/* Consumed */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 items-center">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>Calories Consumed</span>
            </div>
            <span>Limit {calorieLimit}</span>
          </div>
          <h2 className="text-2xl font-bold mt-1">{consumed}</h2>
          <div className="w-full h-2 bg-gray-700 rounded mt-3">
            <div
              className="h-2 bg-emerald-500 rounded"
              style={{ width: `${Math.min((consumed / calorieLimit) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.max(calorieLimit - consumed, 0)} kcal remaining
          </p>
        </div>

        {/* Burned */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <span>Calories Burned</span>
            </div>
            <span>Goal {calorieBurnGoal}</span>
          </div>
          <h2 className="text-2xl font-bold mt-1">{burned}</h2>
          <div className="w-full h-2 bg-gray-700 rounded mt-3">
            <div
              className="h-2 bg-red-500 rounded"
              style={{ width: `${Math.min((burned / calorieBurnGoal) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="themed-surface p-5 rounded-2xl flex flex-col items-start border border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Activity className="w-5 h-5" /> Active
          </div>
          <h2 className="text-xl font-bold mt-2">
            {activeMinutes} minutes today
          </h2>
        </div>

        <div className="themed-surface p-5 rounded-2xl flex flex-col items-start border border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Dumbbell className="w-5 h-5" /> Workouts
          </div>
          <h2 className="text-xl font-bold mt-2">
            {workouts} activities logged
          </h2>
        </div>
      </div>

      {/* Goal & Body Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="themed-surface p-5 rounded-2xl flex flex-col items-start border border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Target className="w-5 h-5" /> Your Goal
          </div>
          <h2 className="text-xl font-bold mt-2">
            {user?.goal === "lose" ? "🔥 Lose Weight" : user?.goal === "gain" ? "💪 Gain Muscle" : "⚖️ Maintain Weight"}
          </h2>
        </div>

        <div className="themed-surface p-5 rounded-2xl border border-[var(--border-color)]">
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <User className="w-5 h-5" /> Body Metrics
          </p>
          <div className="mt-3 space-y-1">
            <p>
              <Ruler className="inline w-4 h-4" /> Height: {height} cm
            </p>
            <p>
              <Flame className="inline w-4 h-4" /> Weight: {weight} kg
            </p>
          </div>
          <div className="mt-3">
            <p>
              BMI: <span className={`font-bold ${bmiColor}`}>{bmi}</span>
            </p>
            <div className="w-full h-2 bg-gray-700 rounded mt-2">
              <div
                className="h-2 rounded"
                style={{
                  width: `${bmiPercentage}%`,
                  backgroundColor: bmiColor.includes("emerald")
                    ? "#22c55e"
                    : bmiColor.includes("yellow")
                      ? "#facc15"
                      : "#ef4444",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Week's Progress Chart */}
      <div className="themed-surface p-5 rounded-2xl mb-6 border border-[var(--border-color)]">
        <p className="text-gray-400 text-sm mb-2">Week's Progress</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="consumed"
              stroke="#22c55e"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="burned"
              stroke="#ef4444"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#facc15"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="themed-surface p-5 rounded-2xl mt-6 border border-[var(--border-color)]">
        <p className="text-gray-400 text-sm">Today's Summary</p>
        <div className="mt-2 text-sm space-y-1">
          <p>Meals logged: {todayFoodLogs.length}</p>
          <p>Total calories: {consumed}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;