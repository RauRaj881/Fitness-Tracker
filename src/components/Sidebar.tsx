import { Home, Utensils, Activity, User, Sun, Moon,PersonStanding } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLocation, Link } from "react-router-dom"; // Assuming you use react-router

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/food", label: "Food", icon: Utensils },
    { path: "/activity", label: "Activity", icon: Activity },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-[#0B1221] text-gray-400 p-4 border-r border-gray-800">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-[#10B981] p-1.5 rounded-lg">
          <PersonStanding className="text-white w-6 h-6" />
        </div>
        <h1 className="text-white text-xl font-bold tracking-tight">
          FitTrack
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-md transition-all group ${
                isActive
                  ? "text-[#10B981] bg-[#10B981]/5"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#10B981] rounded-r-full" />
              )}

              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Theme Toggle */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-4 py-3 w-full hover:text-white transition-colors"
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          <span className="font-medium">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
