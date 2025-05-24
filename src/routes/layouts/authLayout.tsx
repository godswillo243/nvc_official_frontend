import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 h-dvh">
      <div className="flex-center">
        <Outlet />
      </div>
      <div className="hidden md:relative md:flex-center max-h-dvh max-w-full ">
        {/* <img src="/splash.jpg" alt="Logo" /> */}
      </div>
    </section>
  );
}

export default AuthLayout;
