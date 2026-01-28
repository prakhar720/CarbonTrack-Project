// ---------- IMPORTS ----------
import { auth, db } from "./firebase.js";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


// ---------- AUDIT HASH FUNCTION ----------
function generateAuditHash(data) {
  return CryptoJS.SHA256(JSON.stringify(data)).toString();
}


// ---------- WAIT FOR DOM ----------
document.addEventListener("DOMContentLoaded", () => {

  const tableBody = document.querySelector("#reportsTable tbody");

  // ---------- LOAD PENDING REPORTS ----------
  async function loadPendingReports() {
    tableBody.innerHTML =
      "<tr><td colspan='5'>Loading pending reports...</td></tr>";

    try {
      const q = query(
        collection(db, "reports"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        tableBody.innerHTML =
          "<tr><td colspan='5'>No pending reports</td></tr>";
        return;
      }

      tableBody.innerHTML = "";

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.companyId}</td>
          <td>${data.month}</td>
          <td>${data.emissions.totalEmission.toFixed(2)}</td>
          <td>${data.status}</td>
          <td>
            <button 
              class="review-btn"
              data-id="${docSnap.id}"
              data-hash="${data.hash}">
              Review
            </button>
          </td>
        `;

        tableBody.appendChild(row);
      });

    } catch (error) {
      console.error(error);
      tableBody.innerHTML =
        "<tr><td colspan='5'>Error loading reports</td></tr>";
    }
  }

  // ---------- INITIAL LOAD ----------
  loadPendingReports();


  // ---------- HANDLE REVIEW / APPROVE / REJECT ----------
  document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("review-btn")) return;

    const reportId = e.target.dataset.id;
    const submissionHash = e.target.dataset.hash;

    const decision = prompt(
      "Type APPROVE or REJECT to proceed:"
    );

    if (!decision) return;

    if (decision !== "APPROVE" && decision !== "REJECT") {
      alert("Invalid input. Please type APPROVE or REJECT.");
      return;
    }

    const remarks = prompt(
      "Enter remarks for this report:"
    );

    if (!remarks) {
      alert("Remarks are required.");
      return;
    }

    try {
      // ---------- AUDIT HASH DATA ----------
      const auditData = {
        submissionHash,
        decision,
        auditorRemarks: remarks,
        verifiedAt: new Date().toISOString(),
        auditorId: auth.currentUser.uid
      };

      const auditHash = generateAuditHash(auditData);

      // ---------- UPDATE FIRESTORE ----------
      await updateDoc(doc(db, "reports", reportId), {
        status: decision === "APPROVE" ? "approved" : "rejected",
        auditorRemarks: remarks,
        verifiedAt: new Date(),
        auditHash
      });

      alert(`Report ${decision.toLowerCase()}ed successfully`);

      loadPendingReports(); // refresh table

    } catch (error) {
      console.error(error);
      alert("Action failed: " + error.message);
    }
  });

});
