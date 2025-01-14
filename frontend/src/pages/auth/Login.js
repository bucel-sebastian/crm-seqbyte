import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import useNonce from "../../hooks/useNonce";

function Login() {
  const nonce = useNonce();

  return (
    <div>
      <LoginForm nonce={nonce} />
    </div>
  );
}

export default Login;
