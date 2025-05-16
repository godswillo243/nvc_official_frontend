import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-screen h-dvh bg-background flex-center">
      <Link to={"/"} className="btn">Return to home</Link>
    </div>
  );
}

export default NotFound;
