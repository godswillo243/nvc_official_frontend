import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import NotFound from "./routes/custom/notFound";
import {
  AuthLayout,
  HomeRoute,
  LoginRoute,
  RootLayout,
  SignupRoute,
} from "./routes";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loaded = !!sessionStorage.getItem("loaded");
    if (loaded) {
      setIsLoaded(true);
      setTimeout(() => {
        setShowContent(true);
        navigate("/auth/login");
      }, 300); // Add a slight delay for fade-in effect
      return;
    }

    const splashTimeout = setTimeout(() => {
      setIsLoaded(true);
      sessionStorage.setItem("loaded", "yes");

      // Wait briefly before navigating to let fade-in transition feel smoother
      setTimeout(() => {
        setShowContent(true);
        navigate("/auth/login");
      }, 300);
    }, 4000);

    return () => clearTimeout(splashTimeout);
  }, [navigate]);

  return isLoaded ? (
    <div
      className={`transition-opacity duration-700 ease-in-out ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <Routes location={location}>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginRoute />} />
          <Route path="/auth/signup" element={<SignupRoute />} />
        </Route>
        <Route path="/" element={<RootLayout />}>
          <Route path="/home" element={<HomeRoute />} />
        </Route>
        <Route
          index
          element={
            <div className="w-screen h-dvh flex flex-col items-center justify-center text-center space-y-6 px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold">
                Welcome to <span className="text-green-700">NVC</span> OFFICIAL
              </h1>
              <Link
                to={"/auth/login"}
                className="bg-primary px-6 py-2 rounded-full text-primary-foreground font-semibold"
              >
                Get Started
              </Link>
            </div>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  ) : (
    <div
      id="splash"
      className="max-w-screen max-h-dvh overflow-hidden flex items-center justify-center bg-white"
    >
      <img src="/splash.jpg" className="h-96 w-96 animate-fade-in" alt="Splash Screen" />
    </div>
  );
}

export default App;
