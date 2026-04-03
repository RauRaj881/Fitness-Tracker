import { useState } from "react";
import { AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // Import your context
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("signup"); // Use lowercase consistently
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAppContext(); // Get functions from context
  const navigate = useNavigate();

  // THE MISSING HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop page refresh
    setIsSubmitting(true);

    try {
      if (state === "login") {
        await login({ email, password });
        toast.success("Welcome back!");
      } else {
        // Pass username, email, and password to signup
        await signup({ username, email, password } as any);
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <main className="login-page-container min-h-screen flex items-center justify-center bg-black">
        {/* ADDED onSubmit HERE */}
        <form
          onSubmit={handleSubmit}
          className="login-form w-full max-w-md p-8 bg-gray-900 rounded-lg"
        >
          <h2 className="text-3xl font-medium text-white">
            {state === "login" ? "Sign In" : "Sign up"}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {state === "login"
              ? "Please enter email and password to access."
              : "Please enter your details to create an account."}
          </p>

          {/* USERNAME */}
          {state !== "login" && (
            <div className="mt-4">
              <label className="text-sm text-gray-300">Username</label>
              <div className="relative mt-2">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Enter username"
                  className="login-input pl-10 w-full bg-gray-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div className="mt-4">
            <label className="text-sm text-gray-300">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Enter email address"
                className="login-input pl-10 w-full bg-gray-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mt-4">
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="login-input pl-10 w-full bg-gray-800 text-white p-2 rounded outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Processing..."
              : state === "login"
                ? "Login"
                : "Create Account"}
          </button>

          {state === "login" ? (
            <p className="text-center py-6 text-sm text-gray-500">
              Don't have an account?
              <button
                type="button"
                onClick={() => setState("signup")}
                className="ml-1 cursor-pointer text-green-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-center py-6 text-sm text-gray-500">
              Already Have an account?
              <button
                type="button"
                onClick={() => setState("login")}
                className="ml-1 cursor-pointer text-green-600 hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
