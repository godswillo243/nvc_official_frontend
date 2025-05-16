import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
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

  useEffect(() => {
    const loaded = !!sessionStorage.getItem("loaded");
    if (loaded) {
      setIsLoaded(true);
      return;
    } else {
      setIsLoaded(false);
    }
    const splashTimeout = setTimeout(() => {
      setIsLoaded(true);
      sessionStorage.setItem("loaded", "yes");
    }, 4000);
    return () => clearTimeout(splashTimeout);
  }, []);

  return isLoaded ? (
    <>
      <Routes>
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
            <div className="w-screen h-dvh flex-center-column">
              <h1 className="text-4xl md:text-5xl font-extrabold ">
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
    </>
  ) : (
    <div
      id="splash"
      className="max-w-screen max-h-dvh overflow-hidden flex items-center justify-center"
    >
      <img src="/splash.jpg" className="h-96 w-96" alt="" />
    </div>
  );
}

export default App;
