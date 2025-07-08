import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase/firebase";

const keywordMap = {
  "Food & Dining": [
    "eat", "ate", "eating", "ordered", "meal", "lunch", "dinner", "food", "snack", "drink",
    "pad thai", "coffee", "burger", "pizza",
    "กิน", "สั่ง", "อาหาร", "ข้าว", "แกร็บ"
  ],
  "Transport": [
    "taxi", "train", "grab", "uber", "bus", "bts", "mrt", "drive", "rode", "commute",
    "รถ", "บีทีเอส", "เอ็มอาร์ที", "เดินทาง", "ขับ"
  ],
  "Groceries": [
    "grocery", "groceries", "supermarket", "7-11", "tops", "big c", "lotus", "ซื้อของ", "ตลาด", "ซุปเปอร์"
  ],
  "Shopping": [
    "shopping", "clothes", "shirt", "shoes", "bags", "uniqlo", "shopee", "lazada", "ซื้อ", "รองเท้า", "เสื้อผ้า"
  ],
  "Entertainment": [
    "movie", "cinema", "netflix", "spotify", "game", "play", "ดูหนัง", "ฟังเพลง", "เกม"
  ],
  "Health": [
    "hospital", "clinic", "doctor", "dentist", "pharmacy", "medicine", "ยา", "หมอ", "โรงพยาบาล", "ตรวจ"
  ],
  "Utilities": [
    "electricity", "water", "internet", "wifi", "bill", "ค่าน้ำ", "ค่าไฟ", "ค่าเน็ต", "บิล"
  ],
  "Subscriptions": [
    "subscription", "netflix", "spotify", "youtube", "apple", "รายเดือน", "จ่ายรายเดือน", "สมัคร"
  ],
  "Travel": [
    "flight", "hotel", "booking", "airbnb", "ticket", "เที่ยว", "บิน", "โรงแรม", "ทริป"
  ],
  "Gifts": [
    "gift", "present", "donation", "charity", "ของขวัญ", "ให้", "บริจาค"
  ],
  "Education": [
    "course", "tuition", "book", "learn", "เรียน", "หนังสือ", "คอร์ส"
  ],
  "Uncategorized": []
};

function parseExpense(input) {
  const amountMatch = input.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
  const lower = input.toLowerCase();

  // Parse date expressions
  let parsedDate = new Date(); // default to now
  if (lower.includes("yesterday")) {
    parsedDate.setDate(parsedDate.getDate() - 1);
  } else {
    const dateRegex = /\b(on\s)?(\d{1,2}(st|nd|rd|th)?\s+\w+|\w+\s+\d{1,2})\b/;
    const dateText = lower.match(dateRegex);
    if (dateText) {
      const tryDate = new Date(dateText[0].replace(/on\s/, ""));
      if (!isNaN(tryDate.getTime())) {
        parsedDate = tryDate;
      }
    }
  }

  // Parse category by keyword map
  let matchedCategory = "Uncategorized";
  for (const [category, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matchedCategory = category;
      break;
    }
  }

  return {
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, "")) : null,
    date: parsedDate.toISOString().split("T")[0],
    category: matchedCategory,
    note: input,
  };
}

export default function NaturalLanguageInput() {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);

  const handleParse = () => {
    const result = parseExpense(text);
    setParsed(result);
  };

  const handleSubmit = async () => {
    if (!parsed?.amount || !parsed?.category) return alert("Incomplete data");

    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "expenses"), {
        ...parsed,
        userId: user?.uid || "anonymous",
        createdAt: serverTimestamp(),
      });
      alert("Expense logged!");
      setText("");
      setParsed(null);
    } catch (err) {
      console.error("Logging failed", err);
      alert("Error logging expense");
    }
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 mt-8">
      <div className="w-full max-w-md space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Starbucks coffee 120 THB yesterday"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />

        <button
          onClick={handleParse}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
        >
          Parse
        </button>

        {parsed && (
          <div className="bg-white shadow p-4 rounded-md space-y-2 text-sm">
            <p><strong>Amount:</strong> {parsed.amount || "N/A"}</p>
            <p><strong>Category:</strong> {parsed.category}</p>
            <p><strong>Date:</strong> {parsed.date}</p>
            <p><strong>Note:</strong> {parsed.note}</p>
            <button
              onClick={handleSubmit}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Submit to Firestore
            </button>
          </div>
        )}
      </div>
    </div>
  );
}