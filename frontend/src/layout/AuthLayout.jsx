import React from "react";
import { Outlet } from "react-router";
import { ToastContainer, Bounce } from "react-toastify";

function AuthLayout() {
  return (
    <main className="auth-main">
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </main>
  );
}

export default AuthLayout;
