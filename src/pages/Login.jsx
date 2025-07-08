import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Helvetica Neue', sans-serif",
        backgroundColor: "#f8f9fa",
        color: "#2d2d2d",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>💸 MoneyGoWhere</h1>
      <p
        style={{
          fontSize: "1rem",
          maxWidth: "90%",
          marginBottom: "2rem",
          lineHeight: "1.5",
        }}
      >
        Your intelligent personal expense tracker. Log receipts, type natural
        language like "bought coffee for 75 baht", and get clear insights into
        your spending habits. Simple, clean, and private.
      </p>
      <button
        onClick={handleLogin}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          width: "90%",
          maxWidth: "300px",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
}