import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2RedirectHandler = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const username = payload.sub || payload.username;

        localStorage.setItem("jwtUsername", username);
        onLogin({ username, token });

        setTimeout(() => navigate("/"), 100); // wait to ensure state updates
      } catch (err) {
        console.error("Invalid token payload", err);
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, onLogin]);

  return <p>Logging in with Google...</p>;
};

export default OAuth2RedirectHandler;
