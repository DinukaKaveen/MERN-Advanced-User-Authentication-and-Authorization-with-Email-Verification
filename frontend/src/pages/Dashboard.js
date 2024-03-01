import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  axios.defaults.withCredentials = true;
  let firstRender = true;

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      authUser();
    }
    let interval = setInterval(() => {
      refresh();
    }, 1000 * 28);
    return () => clearInterval(interval);

  }, []);

  const authUser = async () => {
    await axios
      .get("http://localhost:8000/api/auth_user")
      .then((response) => {
        if (response.data.authUser) {
          setUser(response.data.user);
          console.log(response.data.message);
        } else {
          console.log(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const refresh = async () => {
    await axios
      .get("http://localhost:8000/api/refresh")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return <div>Dashboard</div>;
}

export default Dashboard;
