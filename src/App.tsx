import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "./routes/custom/notFound";
import {
  AuthLayout,
  HomeRoute,
  LandingRoute,
  LoginRoute,
  RootLayout,
  SignupRoute,
} from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loaded = !!sessionStorage.getItem("loaded");
    if (loaded) {
      setIsLoaded(true);
      return;
    }

    const splashTimeout = setTimeout(() => {
      setIsLoaded(true);
      sessionStorage.setItem("loaded", "yes");
      setTimeout(() => {}, 300);
    }, 4000);

    return () => clearTimeout(splashTimeout);
  }, [navigate]);

  return isLoaded ? (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginRoute />} />
          <Route path="/auth/signup" element={<SignupRoute />} />
        </Route>
        <Route path="/" element={<RootLayout />}>
          <Route path="/home" element={<HomeRoute />} />
        </Route>
        <Route index element={<LandingRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  ) : (
    <div
      id="splash"
      className="max-w-screen max-h-dvh overflow-hidden flex items-center justify-center bg-white"
    >
      <img
        src="/splash.jpg"
        className="h-96 w-96 animate-fade-in"
        alt="Splash Screen"
      />
    </div>
  );
}

export default App;
