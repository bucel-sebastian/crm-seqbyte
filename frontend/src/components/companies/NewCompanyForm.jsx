import React, { useEffect, useState } from "react";
import SelectInput from "../SelectInput";
import { toast } from "react-toastify";

import countriesJson from "../../utils/countries.json";
import romaniaCountiesAndCities from "../../utils/romania-counties-and-cities.json";
import { useAuth } from "../../context/AuthContext";

function NewCompanyForm({ nonce, onSuccess }) {
  const { session } = useAuth();
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    name: "",
    vat: "",
    no_reg_com: "",
    country: "",
    county: "",
    city: "",
    address: "",
    bank_name: "",
    bank_iban: "",
    establishment_date: "",
    owner: "",
  });

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

    if (
      formInputs.name === "" ||
      formInputs.vat === "" ||
      formInputs.no_reg_com === "" ||
      formInputs.country === "" ||
      formInputs.county === "" ||
      formInputs.city === "" ||
      formInputs.address === "" ||
      formInputs.establishment_date === "" ||
      formInputs.owner === ""
    ) {
      toast.error("Va rugam sa completati toate datele obligatorii (*)");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", session.id);
    Object.entries(formInputs).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/campaings/new`,
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
        onSuccess(body.id);
      } else {
        if (
          body.error === "There was a problem when we tried to insert company"
        ) {
          toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
        } else if (body.error === "Company already exists") {
          toast.error("Deja exista o companie cu acest CUI");
        }
      }
    } else {
      toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
    }
    setFormIsLoading(false);
  };

  return (
    <div className="dashboard-form-container">
      <form onSubmit={handleFormSubmit}>
        <div className="dashboard-form-content">
          <div className="dashboard-form-inputs-row">
            <div className="dashboard-form-input-container">
              <label>Nume companie *</label>
              <input
                type="text"
                name="name"
                value={formInputs.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="dashboard-form-input-container">
              <label>CUI *</label>
              <input
                type="text"
                name="vat"
                value={formInputs.vat}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="dashboard-form-inputs-row">
            <div className="dashboard-form-input-container">
              <label>Nr. reg. com. *</label>
              <input
                type="text"
                name="no_reg_com"
                value={formInputs.no_reg_com}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="dashboard-form-input-container">
              <label>Data infintari *</label>
              <input
                type="date"
                name="establishment_date"
                value={formInputs.establishment_date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="dashboard-form-input-container">
            <label>Administrator *</label>
            <input
              type="text"
              name="owner"
              value={formInputs.owner}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="dashboard-form-inputs-row">
            <div className="dashboard-form-input-container">
              <label>Tara *</label>
              <SelectInput
                options={countriesJson.map((country) => ({
                  value: country.alpha2,
                  label: country.name,
                }))}
                value={formInputs.country}
                name="country"
                onChange={handleInputChange}
                isSearchable={true}
              />
            </div>
            <div className="dashboard-form-input-container">
              <label>Judet *</label>
              {formInputs.country === "ro" ? (
                <>
                  <SelectInput
                    options={romaniaCountiesAndCities.map((county) => ({
                      value: county.auto,
                      label: county.nume,
                    }))}
                    value={formInputs.county}
                    name="county"
                    onChange={handleInputChange}
                    isSearchable={true}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="county"
                    value={formInputs.county}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
            </div>
          </div>
          <div className="dashboard-form-inputs-row">
            {" "}
            <div className="dashboard-form-input-container">
              <label>Localitate *</label>
              {formInputs.country === "ro" ? (
                <>
                  <SelectInput
                    options={
                      formInputs.county === ""
                        ? []
                        : romaniaCountiesAndCities
                            .find((county) => county.auto === formInputs.county)
                            .localitati.map((city) => ({
                              value: city.nume,
                              label: city.nume,
                            }))
                    }
                    disabled={formInputs.county === ""}
                    value={formInputs.city}
                    name="city"
                    onChange={handleInputChange}
                    isSearchable={true}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="city"
                    value={formInputs.city}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
            </div>
            <div className="dashboard-form-input-container">
              <label>Adresa *</label>
              <input
                type="text"
                name="address"
                value={formInputs.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="dashboard-form-inputs-row">
            <div className="dashboard-form-input-container">
              <label>Nume banca</label>
              <input
                type="text"
                name="bank_name"
                value={formInputs.bank_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="dashboard-form-input-container">
              <label>Cont banca</label>
              <input
                type="text"
                name="bank_iban"
                value={formInputs.bank_iban}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="dashboard-form-submit-container">
            <button disabled={formIsLoading}>
              {formIsLoading ? <>Se încarcă</> : <>Adauga</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewCompanyForm;
