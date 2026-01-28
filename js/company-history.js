// ---------- IMPORTS ----------
import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";


// ---------- DOM ----------
const tableBody = document.querySelector("#companyReportsTable tbody");


// ---------- AUTH + FETCH ----------
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    tableBody.innerHTML =
      "<tr><td colspan='5'>User not logged in</td></tr>";
    return;
  }

  try {
    // IMPORTANT: filter out old docs without createdAt
    const q = query(
      collection(db, "reports"),
      where("companyId", "==", user.uid),
      where("createdAt", "!=", null),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      tableBody.innerHTML =
        "<tr><td colspan='5'>No reports submitted yet</td></tr>";
      return;
    }

    tableBody.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.month}</td>
        <td>${data.emissions.totalEmission.toFixed(2)}</td>
        <td>${data.status}</td>
        <td>${data.auditorRemarks || "-"}</td>
        <td style="font-size:12px">
          ${data.hash ? data.hash.slice(0, 12) + "...": "-"}
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("History load error:", error);
    tableBody.innerHTML =
      "<tr><td colspan='5'>Error loading reports</td></tr>";
  }
});
