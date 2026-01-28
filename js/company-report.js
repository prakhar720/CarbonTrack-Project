// ---------- IMPORTS ----------
import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";


// ---------- HASH FUNCTION ----------
function generateHash(data) {
  return CryptoJS.SHA256(JSON.stringify(data)).toString();
}


// ---------- FORM ----------
const form = document.getElementById("emissionForm");

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ---------- READ INPUTS ----------
    const month = document.getElementById("month").value;

    const electricity = Number(document.getElementById("electricity").value);
    const fuel = Number(document.getElementById("fuel").value);
    const transport = Number(document.getElementById("transport").value);
    const waste = Number(document.getElementById("waste").value);

    // ---------- DUPLICATE MONTH CHECK ----------
    const monthQuery = query(
      collection(db, "reports"),
      where("companyId", "==", user.uid),
      where("month", "==", month)
    );

    const monthSnapshot = await getDocs(monthQuery);

    if (!monthSnapshot.empty) {
      let latest = null;

      monthSnapshot.forEach(docSnap => {
        const d = docSnap.data();
        if (!latest || d.createdAt?.seconds > latest.createdAt?.seconds) {
          latest = d;
        }
      });

      if (latest.status !== "rejected") {
        alert(
          `A report for ${month} is already ${latest.status}. ` +
          `You can submit again only if it was rejected.`
        );
        return;
      }
    }

    // ---------- EMISSION CALCULATION ----------
    const electricityEF = 0.82;
    const fuelEF = 2.68;

    const electricityEmission = electricity * electricityEF;
    const fuelEmission = fuel * fuelEF;

    const totalEmission =
      electricityEmission +
      fuelEmission +
      transport +
      waste;

    // ---------- EVIDENCE FILES ----------
    const electricityFile =
      document.getElementById("electricityEvidence").files[0];
    const fuelFile =
      document.getElementById("fuelEvidence").files[0];
    const transportFile =
      document.getElementById("transportEvidence").files[0];
    const wasteFile =
      document.getElementById("wasteEvidence").files[0];

    if (!electricityFile || !fuelFile || !transportFile || !wasteFile) {
      alert("Please upload all supporting evidence files");
      return;
    }

    const fakeURL = (file, type) =>
      `storage://evidence/${user.uid}/${month}/${type}_${file.name}`;

    const evidence = {
      electricity: {
        name: electricityFile.name,
        size: electricityFile.size,
        url: fakeURL(electricityFile, "electricity")
      },
      fuel: {
        name: fuelFile.name,
        size: fuelFile.size,
        url: fakeURL(fuelFile, "fuel")
      },
      transport: {
        name: transportFile.name,
        size: transportFile.size,
        url: fakeURL(transportFile, "transport")
      },
      waste: {
        name: wasteFile.name,
        size: wasteFile.size,
        url: fakeURL(wasteFile, "waste")
      }
    };

    try {
      // ---------- FETCH PREVIOUS HASH ----------
      const prevQuery = query(
        collection(db, "reports"),
        where("companyId", "==", user.uid),
        where("createdAt", "!=", null),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const prevSnapshot = await getDocs(prevQuery);

      let prevHash = "GENESIS";
      if (!prevSnapshot.empty) {
        prevHash = prevSnapshot.docs[0].data().hash;
      }

      // ---------- HASH INPUT ----------
      const hashInput = {
        companyId: user.uid,
        month,
        inputs: { electricity, fuel, transport, waste },
        emissions: {
          electricityEmission,
          fuelEmission,
          transport,
          waste,
          totalEmission
        },
        evidence,
        prevHash
      };

      const submissionHash = generateHash(hashInput);

      // ---------- SAVE REPORT ----------
      await addDoc(collection(db, "reports"), {
        companyId: user.uid,
        month,

        inputs: {
          electricity,
          fuel,
          transport,
          waste
        },

        emissions: {
          electricityEmission,
          fuelEmission,
          transport,
          waste,
          totalEmission
        },

        evidence,

        prevHash,
        hash: submissionHash,

        status: "pending",
        createdAt: serverTimestamp()
      });

      alert("Report submitted successfully (Pending verification)");
      form.reset();

    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed: " + error.message);
    }
  });
});
