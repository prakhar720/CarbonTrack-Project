import { db } from "./firebase.js";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const tableBody = document.querySelector("#publicTable tbody");

// ---------- GRADE FUNCTION ----------
function getGrade(total) {
  if (total <= 1000) return "A";
  if (total <= 3000) return "B";
  return "C";
}

async function loadPublicData() {
  tableBody.innerHTML =
    "<tr><td colspan='5'>Loading data...</td></tr>";

  try {
    const q = query(
      collection(db, "reports"),
      where("createdAt", "!=", null),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      tableBody.innerHTML =
        "<tr><td colspan='5'>No public data available</td></tr>";
      return;
    }

    // Keep latest report per company
    const latestByCompany = {};

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (!latestByCompany[data.companyId]) {
        latestByCompany[data.companyId] = data;
      }
    });

    tableBody.innerHTML = "";

    for (const companyId in latestByCompany) {
      const report = latestByCompany[companyId];

      // Fetch company name
      const userSnap = await getDoc(doc(db, "users", companyId));
      const companyName = userSnap.exists()
        ? userSnap.data().orgName
        : "Unknown Company";

      const grade = getGrade(report.emissions.totalEmission);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${companyName}</td>
        <td>${report.month}</td>
        <td>${report.emissions.totalEmission.toFixed(2)}</td>
        <td class="${report.status}">${report.status}</td>
        <td class="grade-${grade}">${grade}</td>
      `;

      tableBody.appendChild(row);
    }

  } catch (error) {
    console.error("Public dashboard error:", error);
    tableBody.innerHTML =
      "<tr><td colspan='5'>Error loading data</td></tr>";
  }
}

loadPublicData();
