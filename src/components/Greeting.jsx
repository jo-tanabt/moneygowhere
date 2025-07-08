import React from "react";
import { auth } from "../firebase/firebase";

export default function Greeting() {
  const user = auth.currentUser;
  const name = user?.displayName || "there";

  const hour = new Date().getHours();
  let timeOfDay = "";

  if (hour < 5) timeOfDay = "night";
  else if (hour < 12) timeOfDay = "morning";
  else if (hour < 18) timeOfDay = "afternoon";
  else timeOfDay = "evening";

  return (
    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
      Good {timeOfDay}, {name}. Happy tracking your money!
    </h2>
  );
}
