import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import useNonce from "../../../hooks/useNonce";

function CompaniesViewAll() {
  const nonce = useNonce();

  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const { session } = useAuth();

  const getTableItems = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/companies`,
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

  const handleDeleteItem = async (e) => {
    e.preventDefault();
    const { value } = e.currentTarget;
  };

  useEffect(() => {
    if (dataIsLoading) {
      getTableItems();
    }
  }, []);
  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Companii</h1>{" "}
        <Link to="/dashboard/companies/new">Companie nouă</Link>
      </div>
      {dataIsLoading ? (
        <>Se incarca</>
      ) : (
        <>
          <div>
            {tableItems.length === 0 ? (
              <>
                <div>
                  <p>Nu există date de afișat</p>
                  <Link to="/dashboard/companies/new">Companie nouă</Link>
                </div>
              </>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Nr.</th>
                      <th>Nume</th>
                      <th>CUI</th>
                      <th>Nr. Reg. Com.</th>
                      <th>Țară</th>
                      <th>Administrator</th>
                      <th>Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableItems.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index}</td>
                        <td>{item.name}</td>
                        <td>{item.vat}</td>
                        <td>{item.no_reg_com}</td>
                        <td>{item.country}</td>
                        <td>{item.owner}</td>
                        <td>
                          <Link
                            to={`/dashboard/companies/edit/${item.id}`}
                          ></Link>
                          <button
                            type="button"
                            onClick={handleDeleteItem}
                            value={item.id}
                          ></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CompaniesViewAll;
