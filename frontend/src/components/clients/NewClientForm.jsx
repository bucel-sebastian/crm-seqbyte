import React, { useEffect, useState } from "react";
import SelectInput from "../SelectInput";
import { toast } from "react-toastify";

import countriesJson from "../../utils/countries.json";
import romaniaCountiesAndCities from "../../utils/romania-counties-and-cities.json";
import { useAuth } from "../../context/AuthContext";

import { FaFileCircleCheck } from "react-icons/fa6";
import Tooltip from "@mui/material/Tooltip";
import { translateDiacritics } from "../../utils/translateDiacritics";

function NewClientForm({ nonce, onSuccess }) {
  const { session } = useAuth();
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [formInputs, setFormInputs] = useState({
    name: "",
    vat: "",
    tva_payer: "no",
    no_reg_com: "",
    country: "",
    county: "",
    city: "",
    address: "",
    bank_name: "",
    bank_iban: "",
    establishment_date: "",
  });

  const [showDetailsApiRequest, setShowDetailsApiRequest] = useState(false);

  const requestCompanyData = async (e) => {
    e.preventDefault();

    if (formInputs.vat !== "") {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/companies/autocomplete?vat=${formInputs.vat}`,
        {
          headers: {
            "x-api-nonce": nonce,
          },
        }
      );
      if (response.ok) {
        const body = await response.json();

        if (body.status === "success") {
          const adresa = body?.data?.adresa.split(", ");
          let county, city, adresaFull;

          if (adresa[adresa.length - 2] === "București") {
            county = romaniaCountiesAndCities.find(
              (county) => translateDiacritics(county.nume) === "Bucuresti"
            );

            city = county.localitati.find(
              (oras) =>
                translateDiacritics(oras.nume) ===
                translateDiacritics(
                  adresa[adresa.length - 1].replace("Sect", "Sector")
                )
            ).nume;

            adresaFull = adresa.slice(0, -3).join(", ");
          } else {
            county = romaniaCountiesAndCities.find(
              (county) =>
                translateDiacritics(county.nume) ===
                translateDiacritics(body?.data?.judet)
            );

            city = county.localitati.find(
              (oras) =>
                translateDiacritics(oras.nume) ===
                translateDiacritics(adresa[adresa.length - 1])
            ).nume;

            adresaFull = adresa.slice(0, -2).join(", ");
          }

          setFormInputs((prevState) => ({
            ...prevState,
            name: body?.data?.denumire,
            tva_payer: body?.data?.tva === null ? "no" : "yes",
            no_reg_com: `${body?.data?.numar_reg_com.slice(
              0,
              3
            )}/${body?.data?.numar_reg_com.slice(
              3,
              -4
            )}/${body?.data?.numar_reg_com.slice(-4)}`,
            country: "ro",
            county: county?.auto,
            city: city,
            address: adresaFull,
          }));

          toast.success("Datele companiei au fost autocompletate!");
        } else {
          if (body.error === "VAT code is invalid.") {
            toast.error("CUI-ul introdus nu este valid.");
          } else {
            toast.error(
              "A aparut o problema, va rugam sa incercati mai tarziu!"
            );
          }
        }
      } else {
        toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "vat") {
      setShowDetailsApiRequest(value.length === 0 ? false : true);
    }

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
      formInputs.address === ""
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
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/clients/new`,
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
          body.error === "There was a problem when we tried to insert client"
        ) {
          toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
        } else if (body.error === "Client already exists") {
          toast.error("Deja exista un client cu acest CUI");
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
              <div>
                <label>CUI *</label>
                <Tooltip title="Autocompleteaza datele">
                  <button
                    type="button"
                    className={`dashboard-autocomplete-button ${
                      showDetailsApiRequest ? "is-visible" : ""
                    }`}
                    onClick={requestCompanyData}
                  >
                    <FaFileCircleCheck />
                  </button>
                </Tooltip>
              </div>
              <input
                type="text"
                name="vat"
                value={formInputs.vat}
                onChange={handleInputChange}
                required
              />
            </div>
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
              <label>Platitor de TVA *</label>
              <SelectInput
                options={[
                  {
                    value: "no",
                    label: "Nu",
                  },
                  {
                    value: "yes",
                    label: "Da",
                  },
                ]}
                value={formInputs.tva_payer}
                name="tva_payer"
                onChange={handleInputChange}
              />
            </div>
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

export default NewClientForm;
