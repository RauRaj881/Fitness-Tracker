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

const App = () => {
  const { user, OnboardingCompleted, isUserFetched } = useAppContext();

  // Show loading spinner while checking for existing session
  if (!isUserFetched) {
    return <Loading />;
  }

  // Not logged in → show Login page
  if (!user) {
    return (
      <>
        <Login />
      </>
    );
  }

  // Logged in but onboarding not completed → show Onboarding
  if (!OnboardingCompleted) {
    return (
      <>
        <Onboarding />
      </>
    );
  }

  // Logged in + onboarding done → show the main app
  return (
    <>
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
