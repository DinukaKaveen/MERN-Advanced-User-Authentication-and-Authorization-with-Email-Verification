import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  //const navigate = useNavigate();
  //const [user, setUser] = useState();

  axios.defaults.withCredentials = true;
  let firstRender = true;

  const authUser = async () => {
    const response = await axios
      .get("http://localhost:8000/api/auth_user")
      .catch((err) => {
        console.error(err);
      });

    const data = await response.data;
    return data;
  };

  const refresh = async () => {
    const response = await axios
      .get("http://localhost:8000/api/refresh")
      .catch((err) => {
        console.error(err);
      });

    const data = await response.data;
    return data;
  };

  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      authUser().then((data) => {
        //setUser(data.user);
      });
    }
    let interval = setInterval(() => {
      refresh().then((data) => {
        //setUser(data.user);
      });
    }, 1000 * 25);

    return () => clearInterval(interval);
  }, []);

  return <div>Dashboard</div>;
}

export default Dashboard;
