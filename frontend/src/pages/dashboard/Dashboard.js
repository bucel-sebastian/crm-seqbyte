import React from "react";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { session } = useAuth();

  return (
    <div>
      <div className="dashboard-page-title">
        <h1>Bine ai venit, {session.first_name}</h1>
      </div>
    </div>
  );
}

export default Dashboard;
