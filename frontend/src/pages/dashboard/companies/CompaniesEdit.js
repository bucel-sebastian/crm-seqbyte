import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import EditCompanyForm from "../../../components/companies/EditCompanyForm";
import useNonce from "../../../hooks/useNonce";

function CompaniesEdit() {
  const nonce = useNonce();
  const { id } = useParams();

  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);

  const getInitialData = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/companies/single?id=${id}`,
      {
        headers: {
          "x-api-nonce": nonce,
        },
      }
    );
    if (response.ok) {
      const body = await response.json();
      console.log(body);
      setInitialData(body.data);
    } else {
      navigate("/dashboard/404");
    }
  };

  useEffect(() => {
    console.log(id);
    if (initialData === null && id) {
      getInitialData(id);
    }
  }, [id]);

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Modifica compania</h1>{" "}
        <Link to="/dashboard/companies">Renunță</Link>
      </div>
      <div>
        {initialData !== null ? (
          <>
            <EditCompanyForm nonce={nonce} initialData={initialData} />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default CompaniesEdit;
