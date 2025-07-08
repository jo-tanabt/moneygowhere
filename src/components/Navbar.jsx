import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Navbar() {
  const handleLogout = () => {
    signOut(auth).catch((error) => {
      console.error("Sign out error:", error);
    });
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>MoneyGoWhere</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: "0.4rem 0.8rem",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#ef4444",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Sign Out
      </button>
    </nav>
  );
}
