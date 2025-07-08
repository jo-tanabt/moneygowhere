import React from "react";
import Navbar from "../components/Navbar";
import Greeting from "../components/Greeting";
import ManualExpenseForm from "../components/ManualExpenseForm";
import NaturalLanguageInput from "../components/NaturalLanguageInput";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-8 min-h-screen bg-gray-50 font-sans">
        <Greeting />
        <div className="space-y-12">
          <NaturalLanguageInput />
          <ManualExpenseForm />
        </div>
        {/* Future dashboard content will go here */}
      </div>
    </>
  );
}
