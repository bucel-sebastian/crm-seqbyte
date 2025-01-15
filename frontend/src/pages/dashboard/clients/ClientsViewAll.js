import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import useNonce from "../../../hooks/useNonce";
function ClientsViewAll() {
  const nonce = useNonce();

  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const { session } = useAuth();

  const getTableItems = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/clients`,
      {
        headers: {
          "x-api-nonce": nonce,
        },
      }
    );
    if (response.ok) {
      const body = response.json();
    }
    setDataIsLoading(false);
  };

  useEffect(() => {
    if (dataIsLoading) {
      getTableItems();
    }
  }, []);

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Clienți</h1> <Link to="/dashboard/clients/new">client nou</Link>
      </div>
      {dataIsLoading ? <>Se incarca</> : <></>}
    </div>
  );
}

export default ClientsViewAll;
