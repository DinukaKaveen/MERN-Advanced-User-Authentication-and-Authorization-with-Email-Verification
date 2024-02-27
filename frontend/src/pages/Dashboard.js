import axios from "axios";
import React, { useEffect } from "react";

function Dashboard() {

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    await axios
      .get("http://localhost:8000/verifyToken")
      .then((response) => {
        if (response.data.verifyToken) {
          //window.location.href = "/dashboard";
          console.log(response.data.message);

        } else {
          window.location.href = "/";
          console.log(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };


  return (
    <div>Dashboard</div>
  )}

export default Dashboard;
