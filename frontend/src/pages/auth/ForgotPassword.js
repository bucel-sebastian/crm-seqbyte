import React from "react";
import useNonce from "../../hooks/useNonce";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

function ForgotPassword() {
  const nonce = useNonce();

  return (
    <div className="auth-main-content">
      <ForgotPasswordForm nonce={nonce} />
    </div>
  );
}

export default ForgotPassword;
