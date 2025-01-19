import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import useNonce from "../../../hooks/useNonce";
import { toast } from "react-toastify";

import countriesJson from "../../../utils/countries.json";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";

import { FaPenToSquare, FaTrashCan, FaEye } from "react-icons/fa6";

function CompaniesViewAll() {
  const nonce = useNonce();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [tableItems, setTableItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const { session } = useAuth();

  const getTableItems = async (page, rowsPerPage) => {
    setDataIsLoading(true);
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/companies/list?page=${
        page + 1
      }&rowsPerPage=${rowsPerPage}`,
      {
        headers: {
          "x-api-nonce": nonce,
        },
      }
    );
    if (response.ok) {
      const body = await response.json();

      setTableItems(body.data);
      setTotalItems(body.count);
    }
    setDataIsLoading(false);
  };

  const handleDeleteItem = async (e) => {
    e.preventDefault();
    if (window.confirm("Sigur doresti sa stergi aceasta companie?")) {
      const { value } = e.currentTarget;

      const formData = new FormData();
      formData.append("id", value);
      formData.append("user_id", session.id);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/companies/delete`,
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
        console.log(body);
        if (body.status === "success") {
          toast.success("Compania a fost stearsa cu success");
          setPage(0);
          getTableItems(0, rowsPerPage);
        } else {
          toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
        }
      } else {
        toast.error("A aparut o problema, va rugam sa incercati mai tarziu!");
      }
    }
    return;
  };

  useEffect(() => {
    getTableItems(page, rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Companii</h1>{" "}
        <Link to="/dashboard/companies/new">Companie nouă</Link>
      </div>

      <TableContainer>
        <Table className="dashboard-table">
          <TableHead>
            <TableRow>
              <TableCell>Nr.</TableCell>
              <TableCell>Nume</TableCell>
              <TableCell>CUI</TableCell>
              <TableCell>Nr. Reg. Com.</TableCell>
              <TableCell>Țară</TableCell>
              <TableCell>Administrator</TableCell>
              <TableCell>Acțiuni</TableCell>
            </TableRow>
          </TableHead>
          {dataIsLoading ? (
            <>
              <TableBody>
                {Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation={"wave"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableBody>
                {tableItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{page * rowsPerPage + (index + 1)}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.vat}</TableCell>
                    <TableCell>{item.no_reg_com}</TableCell>
                    <TableCell>
                      {
                        countriesJson.find(
                          (country) => country.alpha2 === item.country
                        ).name
                      }
                    </TableCell>
                    <TableCell>{item.owner?.name}</TableCell>
                    <TableCell>
                      <span className="dashboard-table-actions-container">
                        {/* <Tooltip title="Vizualizeaza">
                          <Link
                            className="dashboard-table-action-button"
                            to={`/dashboard/companies/preview/${item.id}`}
                            style={{ background: "var(--accent-blue)" }}
                          >
                            <FaEye />
                          </Link>
                        </Tooltip> */}
                        <Tooltip title="Modifica">
                          <Link
                            className="dashboard-table-action-button"
                            to={`/dashboard/companies/edit/${item.id}`}
                            style={{
                              background: "var(--accent-orange)",
                            }}
                          >
                            <FaPenToSquare />
                          </Link>
                        </Tooltip>
                        <Tooltip title="Sterge">
                          <button
                            className="dashboard-table-action-button"
                            type="button"
                            onClick={handleDeleteItem}
                            value={item.id}
                            style={{ background: "var(--accent-red)" }}
                          >
                            <FaTrashCan />
                          </button>
                        </Tooltip>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
      <TablePagination
        className="dashboard-table-pagination"
        rowsPerPageOptions={[10, 25, 50]}
        count={totalItems}
        component={"div"}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Randuri per pagina"
        labelDisplayedRows={({ from, to, count, page }) => {
          return `${from}-${to} randuri din ${count}`;
        }}
      />
    </div>
  );
}

export default CompaniesViewAll;
