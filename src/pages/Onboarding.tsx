import { Toaster } from "react-hot-toast";
import {
  PersonStanding,
  ScaleIcon,
  User,
  TargetIcon,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import type { ProfileFormData } from "../types";
import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

const goalOptions = [
  { value: "lose", label: "Lose Weight" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "gain", label: "Gain Muscle" },
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const { setOnboardingCompleted, setUser } = useAppContext();

  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2500,
    dailyCalorieBurn: 550,
  });

  const totalSteps = 3;

  const updateField = (
    field: keyof ProfileFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.age || formData.age < 13 || formData.age > 120) {
        toast.error("Age must be between 13 and 120");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
        toast.error("Enter valid weight (20–300 kg)");
        return false;
      }
      if (!formData.height || formData.height < 100 || formData.height > 250) {
        toast.error("Enter valid height (100–250 cm)");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      const userData = {
        ...formData,
        name: "User", // or ask user name later
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("fitnessUser", JSON.stringify(userData));

      // 🔥 IMPORTANT: set user in context
      setUser(userData);
      toast.dismiss();

      toast.success("Profile created successfully 🚀");
      setOnboardingCompleted(true);
    }
  };

  return (
    <>
      <Toaster />

      <div className="min-h-screen bg-linear
      -to-br from-[#0f172a] to-[#020617] text-white flex flex-col">
        {/* Header */}
        <div className="p-6 pt-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <PersonStanding className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold">FitTrack</h1>
          </div>
          <p className="text-slate-400">Let's personalize your experience</p>
        </div>

        {/* Progress */}
        <div className="px-6 mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-[#022c22] border border-emerald-700 flex items-center justify-center">
                  <User className="size-6 text-emerald-400" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">How old are you?</h2>
                <p className="text-slate-400 text-sm">
                  This helps us calculate your needs
                </p>
              </div>

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(v) => updateField("age", Number(v))}
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-[#022c22] border border-emerald-700 flex items-center justify-center">
                  <ScaleIcon className="size-6 text-emerald-400" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">Your measurements</h2>
                <p className="text-slate-400 text-sm">
                  This helps track your progress
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(v) => updateField("weight", Number(v))}
                />

                <Input
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(v) => updateField("height", Number(v))}
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-xl bg-[#022c22] border border-emerald-700 flex items-center justify-center">
                  <TargetIcon className="size-6 text-emerald-400" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold">What's your goal?</h2>
                <p className="text-slate-400 text-sm">
                  We'll tailor your experience
                </p>
              </div>

              {/* Goal Buttons */}
              <div className="space-y-4">
                {goalOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateField("goal", option.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      formData.goal === option.value
                        ? "border-emerald-400 bg-[#0f172a] ring-2 ring-emerald-400"
                        : "border-slate-700 bg-[#020617] hover:border-emerald-500"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <div className="mt-8 space-y-6">
                <h3 className="text-sm text-slate-400 font-medium">
                  Daily Targets
                </h3>

                {/* Intake */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Calorie Intake</span>
                    <span className="text-emerald-400">
                      {formData.dailyCalorieIntake} kcal
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1500}
                    max={4000}
                    value={formData.dailyCalorieIntake}
                    onChange={(e) =>
                      updateField("dailyCalorieIntake", Number(e.target.value))
                    }
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Burn */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Calorie Burn</span>
                    <span className="text-emerald-400">
                      {formData.dailyCalorieBurn} kcal
                    </span>
                  </div>

                  <input
                    type="range"
                    min={100}
                    max={1500}
                    value={formData.dailyCalorieBurn}
                    onChange={(e) =>
                      updateField("dailyCalorieBurn", Number(e.target.value))
                    }
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="p-6 pb-10">
          <div className="flex gap-3 justify-end">
            {step > 1 && (
              <Button
                onClick={() => setStep((prev) => prev - 1)}
                className="bg-[#1e293b] text-white rounded-xl px-4 py-2"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
            )}

            <Button
              onClick={handleNext}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-2"
            >
              {step === totalSteps ? "Get Started" : "Continue"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
