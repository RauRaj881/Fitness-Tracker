import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import DashBoard from "./pages/DashBoard";
import FoodLog from "./pages/FoodLog";
import ActivityLog from "./pages/ActivityLog"; 
import Profile from "./pages/Profile";
import { useAppContext } from "./context/AppContext" 
import Login from "./pages/login.tsx"
import Loading from "./components/Loading.tsx"
import Onboarding from "./pages/Onboarding"
import { Toaster }  from "react-hot-toast"

const App = () => {
  const { user, OnboardingCompleted } = useAppContext();

  // 1. If there is no user, show the Login page
  if (!user) {
    return (
      <>
        <Toaster />
        <Login />
      </>
    );
  }

  // 2. If user exists but hasn't finished onboarding, show Onboarding
  if (!OnboardingCompleted) {
    return (
      <>
        <Toaster />
        <Onboarding />
      </>
    );
  }

  // 3. If authenticated AND onboarded, show the main App
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};
export default App;
