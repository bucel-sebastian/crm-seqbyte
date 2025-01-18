import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import useNonce from "../../../hooks/useNonce";
import NewCompanyForm from "../../../components/companies/NewCompanyForm";

function CompaniesNew() {
  const nonce = useNonce();
  const [companyCreated, setCompanyCreated] = useState(false);

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Campanie nouă</h1>{" "}
        {companyCreated === false && (
          <Link to="/dashboard/companies">Renunță</Link>
        )}
      </div>
      <div>
        {companyCreated ? (
          <>
            <h3>Compania a fost adaugata cu succes!</h3>
            <button onClick={() => setCompanyCreated(false)}>
              Adauga o companie noua
            </button>
            <Link to="/dashboard/companies">Vezi toate companiile</Link>
          </>
        ) : (
          <>
            <NewCompanyForm
              nonce={nonce}
              onSuccess={() => setCompanyCreated(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default CompaniesNew;
