import React from "react";
import PasswordResetForm from "../../components/auth/PasswordResetForm";
import useNonce from "../../hooks/useNonce";

function PasswordReset() {
  const nonce = useNonce();

  return (
    <div className="auth-main-content">
      <PasswordResetForm nonce={nonce} />
    </div>
  );
}

export default PasswordReset;
