import { Link } from "react-router-dom";

function Landing() {
  return (
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
  );
}

export default Landing;
