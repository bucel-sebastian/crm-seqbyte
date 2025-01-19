import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import useNonce from "../../../hooks/useNonce";
import NewClientForm from "../../../components/clients/NewClientForm";

function ClientsNew() {
  const nonce = useNonce();
  const [clientCreated, setClientCreated] = useState(false);

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Client nou</h1>{" "}
        {clientCreated === false && (
          <Link to="/dashboard/companies">Renunță</Link>
        )}
      </div>
      <div>
        {clientCreated ? (
          <>
            <h3>Clientul a fost adaugat cu success!</h3>
            <button onClick={() => setClientCreated(false)}>
              Adauga un client nou
            </button>
            <Link to="/dashboard/clients">Vezi toti clienti</Link>
          </>
        ) : (
          <>
            <NewClientForm
              nonce={nonce}
              onSuccess={() => setClientCreated(true)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ClientsNew;
