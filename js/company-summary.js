import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// ----- SELECT EXISTING ELEMENTS -----
const values = document.querySelectorAll(".stats .value");

const totalEmissionEl = values[0];   // Total Emissions
const lastSubmissionEl = values[1];  // Last Submission
const statusEl = values[2];          // Verification Status

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const q = query(
      collection(db, "reports"),
      where("companyId", "==", user.uid),
      where("createdAt", "!=", null),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      totalEmissionEl.textContent = "-- tCO₂";
      lastSubmissionEl.textContent = "Not Submitted";
      statusEl.textContent = "No Reports";
      statusEl.className = "value";
      return;
    }

    const data = snapshot.docs[0].data();

    // ----- UPDATE CARDS -----
    totalEmissionEl.textContent =
      data.emissions.totalEmission.toFixed(2) + " tCO₂";

    lastSubmissionEl.textContent = data.month;

    statusEl.textContent = data.status;
    statusEl.className = "value " + data.status;

  } catch (error) {
    console.error("Summary cards error:", error);
  }
});
