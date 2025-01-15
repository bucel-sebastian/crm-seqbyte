import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import useNonce from "../../../hooks/useNonce";

function CompaniesNew() {
  const nonce = useNonce();

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Campanie nouă</h1> <Link to="/dashboard/companies">Renunță</Link>
      </div>
    </div>
  );
}

export default CompaniesNew;
