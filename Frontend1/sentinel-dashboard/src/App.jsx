import React, { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import SentinelAI from "./SentinelAI";
import AnalystDashboard from "./AnalystDashboard";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(null);

  const handleLogin  = (userData) => setAuth(userData);
  const handleLogout = () => setAuth(null);

  return (
    <div style={layoutStyles.appContainer}>
      {!auth ? (
        <div style={{ width: "100%", height: "100%" }}>
          <LoginScreen onLogin={handleLogin} />
        </div>
      ) : auth.role === "ANALYST" ? (
        <div style={layoutStyles.mainContent}>
          <AnalystDashboard auth={auth} onLogout={handleLogout} />
        </div>
      ) : (
        <div style={layoutStyles.mainContent}>
          <SentinelAI auth={auth} onLogout={handleLogout} />
        </div>
      )}
    </div>
  );
}

const layoutStyles = {
  appContainer: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#050608",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    overflowY: "auto",
    scrollBehavior: "smooth",
  },
};

export default App;