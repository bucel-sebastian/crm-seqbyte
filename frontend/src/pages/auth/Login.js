import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import useNonce from "../../hooks/useNonce";

function Login() {
  const nonce = useNonce();

  return (
    <div className="auth-main-content">
      <LoginForm nonce={nonce} />
    </div>
  );
}

export default Login;
