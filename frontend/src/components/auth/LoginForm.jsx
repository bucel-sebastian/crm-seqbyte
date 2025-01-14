import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {toast}  from 'react-toastify';

function LoginForm({nonce}) {
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    remember_me: false,
  });

  const navigate = useNavigate();
  const {login} = useAuth();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormInputs((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormIsLoading(true);

    const formData = new FormData();
    formData.append("email", formInputs.email);
    formData.append("password", formInputs.password);
    formData.append("remember_me", formInputs.remember_me);
    
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/login`,
        {
          method: "POST",
          headers: {
            "x-api-nonce":nonce
          },
          body: formData,
        }
      );
      if(response.ok){
        const body = await response.json();
        console.log(body);
        if(body.status === "success"){
          const token = body.token;
          if(token) {
            login(token);
            navigate('/dashboard');
            toast.success("Autentificare reusita!");
          } else {
            toast.error('A aparut o problema, va rugam sa incercati mai tarziu!');
          }
        }
        else {
          if(body.error === "User doesn't exist"){
            toast.error('Acest cont de utilizator nu exista');
          } else if (body.error === "User is not activated") {  
            toast.error('Acest cont de utilizator nu este activat');
          } else if (body.error === "Wrong password") { 
            toast.error('Parola este gresita');
          } else if (body.error === "Email and password are required") { 
            toast.error('Adresa de email si parola sunt obligatorii');
          }
          
        }
      } 
      else {
        toast.error('A aparut o problema, va rugam sa incercati mai tarziu!');
      }
    
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
