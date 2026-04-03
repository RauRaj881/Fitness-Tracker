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

  // Calculations
  const consumed = allFoodLogs.reduce((sum, item) => sum + item.calories, 0);
  const burned = allActivityLogs.reduce((sum, item) => sum + item.calories, 0);
  const activeMinutes = allActivityLogs.reduce(
    (sum, item) => sum + item.duration,
    0,
  );
  const workouts = allActivityLogs.length;
  const weight = 75;
  const height = 175;
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

  // Sample week's progress data
  const weekData = [
    { day: "Mon", consumed: 2800, burned: 350, active: 40 },
    { day: "Tue", consumed: 3000, burned: 400, active: 50 },
    { day: "Wed", consumed: 2500, burned: 300, active: 30 },
    { day: "Thu", consumed: 3200, burned: 450, active: 60 },
    { day: "Fri", consumed: 3100, burned: 420, active: 55 },
    { day: "Sat", consumed: 2900, burned: 380, active: 45 },
    { day: "Sun", consumed: 2700, burned: 360, active: 35 },
  ];
  const bmiPercentage = Math.min((bmi / 30) * 100, 100);

  return (
    <div className="flex-1 bg-[#020817] text-white p-6">
      {/* Header */}
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome Back</p>
        <h1 className="text-2xl font-bold mt-1">
          {`Hi there! 👋 ${user?.name}`}
        </h1>

        {/* Motivation */}
        <div className="mt-4 bg-white/10 p-3 rounded-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          <span>Great workout today! Keep it up!</span>
        </div>
      </div>

      {/* Calories Card */}
      <div className="bg-[#080808] p-6 rounded-2xl mb-6 shadow-lg space-y-6">
        {/* Consumed */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 items-center">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <span>Calories Consumed</span>
            </div>
            <span>Limit 3200</span>
          </div>
          <h2 className="text-2xl font-bold mt-1">{consumed}</h2>
          <div className="w-full h-2 bg-gray-700 rounded mt-3">
            <div
              className="h-2 bg-emerald-500 rounded"
              style={{ width: `${Math.min((consumed / 3200) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {3200 - consumed} kcal remaining
          </p>
        </div>

        {/* Burned */}
        <div>
          <div className="flex justify-between text-sm text-gray-400 items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-400" />
              <span>Calories Burned</span>
            </div>
            <span>Goal 400</span>
          </div>
          <h2 className="text-2xl font-bold mt-1">{burned}</h2>
          <div className="w-full h-2 bg-gray-700 rounded mt-3">
            <div
              className="h-2 bg-red-500 rounded"
              style={{ width: `${Math.min((burned / 400) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#0B1221] p-5 rounded-2xl flex flex-col items-start">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Activity className="w-5 h-5" /> Active
          </div>
          <h2 className="text-xl font-bold mt-2">
            {activeMinutes} minutes today
          </h2>
        </div>

        <div className="bg-[#0B1221] p-5 rounded-2xl flex flex-col items-start">
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
        <div className="bg-[#0B1221] p-5 rounded-2xl flex flex-col items-start">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Target className="w-5 h-5" /> Your Goal
          </div>
          <h2 className="text-xl font-bold mt-2">💪 Gain Muscles</h2>
        </div>

        <div className="bg-[#0B1221] p-5 rounded-2xl">
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
      <div className="bg-[#0B1221] p-5 rounded-2xl mb-6">
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
      <div className="bg-[#0B1221] p-5 rounded-2xl mt-6">
        <p className="text-gray-400 text-sm">Today's Summary</p>
        <div className="mt-2 text-sm space-y-1">
          <p>Meals logged: {allFoodLogs.length}</p>
          <p>Total calories: {consumed}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;