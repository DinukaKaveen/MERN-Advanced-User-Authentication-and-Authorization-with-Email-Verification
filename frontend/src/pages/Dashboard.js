import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  //const [user, setUser] = useState();

  axios.defaults.withCredentials = true;
  let firstRender = true;

  const authUser = async () => {
    await axios
      .get("http://localhost:8000/api/auth_user")
      .then((response) => {
        if (response.data.authUser) {
          //setUser(response.data.user);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  };

  const refresh = async () => {
    await axios
      .get("http://localhost:8000/api/refresh")
      .then((response) => {
        if (response.data.refresh) {
          //setUser(response.data.user);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/");
      });
  };

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      authUser();
    }
    let interval = setInterval(() => {
      refresh();
    }, 1000 * 60 * 10);

    return () => clearInterval(interval);
  }, []);

  return <div>Dashboard</div>;
}

export default Dashboard;
