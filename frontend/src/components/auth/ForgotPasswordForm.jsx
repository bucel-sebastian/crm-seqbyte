import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import logoBlack from "../../assets/images/logo_black.svg";
import logoWhite from "../../assets/images/logo_white.svg";
import ThemeContext from "../../context/ThemeContext";

function ForgotPasswordForm({ nonce }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { login, session } = useAuth();

  const [formIsLoading, setFormIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    email: "",
  });
  const [tokenGenerated, setTokenGenerated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsLoading(true);

    const formData = new FormData();
    formData.append("email", formInputs.email);

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "x-api-nonce": nonce,
        },
        body: formData,
      }
    );
    if (response.ok) {
      const body = await response.json();

      if (body.status === "success") {
        setTokenGenerated(true);
      } else {
        if (body.error === "User doesn't exist") {
          toast.error("Acest cont de utilizator nu exista");
        } else if (body.error === "User is not activated") {
          toast.error("Acest cont de utilizator nu este activat");
        } else if (
          body.error ===
          "There was a problem while we tried to generate the recover token"
        ) {
          toast.error("A aparut o problema in timp ce se genera tokenul");
        } else if (
          body.error === "A aparut o problema la trimiterea tokenului"
        ) {
          toast.error("Parola este gresita");
        } else if (body.error === "Email and password are required") {
          toast.error("Adresa de email si parola sunt obligatorii");
        }
      }
    } else {
      toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
    }

    setFormIsLoading(false);
  };

  if (session) {
    navigate("/dashboard", "replace");
    return;
  }

  return (
    <div className="auth-form-container">
      <img
        className="auth-form-logo"
        src={theme === "light-mode" ? logoBlack : logoWhite}
      />
      {tokenGenerated ? (
        <>
          <h3 style={{ textAlign: "center" }}>
            A fost trimis pe mailul introdus un link pentru resetarea parolei.
          </h3>
          <Link
            to="/login"
            className="auth-page-link"
            style={{ marginTop: "15px" }}
          >
            Inapoi la autentificare
          </Link>
        </>
      ) : (
        <>
          <form onSubmit={handleFormSubmit}>
            <div className="auth-form-content">
              <div className="auth-form-input-container">
                <label>Adresa de email</label>
                <input
                  type="email"
                  name="email"
                  value={formInputs.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="auth-form-submit-container">
                <button disabled={formIsLoading}>
                  {formIsLoading ? <>Se încarcă</> : <>Trimite</>}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default ForgotPasswordForm;
