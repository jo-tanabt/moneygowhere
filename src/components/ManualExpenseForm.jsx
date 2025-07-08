import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebase";

export default function ManualExpenseForm() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    note: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return alert("Amount and category required");

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "expenses"), {
        ...form,
        amount: parseFloat(form.amount),
        userId: user?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });

      alert("Expense logged!");
      setForm({
        amount: "",
        category: "",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error logging expense:", error.message, error.code, error.stack);
      alert("Failed to log expense.");
    }
  };

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-8">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-md rounded-lg p-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (THB)</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Log Expense
          </button>
        </form>
      </div>
    </div>
  );
}