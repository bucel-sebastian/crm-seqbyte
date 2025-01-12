import React, { useState } from "react";

function LoginForm() {
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    remember_me: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsLoading(true);
    // const response = await fetch()
    setFormIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="form-input-container">
          <label>Adresa de email</label>
          <input
            type="email"
            name="email"
            value={formInputs.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-input-container">
          <label>Parola</label>
          <input
            type="password"
            name="password"
            value={formInputs.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-checkbox-container">
          <label>
            <input
              type="checkbox"
              name="remember_me"
              onChange={handleInputChange}
            />{" "}
            Tine-mă minte
          </label>
        </div>
        <div className="form-submit-container">
          <button disabled={formIsLoading}>
            {formIsLoading ? <>Se încarcă</> : <>Autentificare</>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
