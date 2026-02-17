import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  // ================= EMAIL LOGIN =================
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userSnap = await getDoc(
          doc(db, "users", userCred.user.uid)
        );

        if (!userSnap.exists()) {
          alert("User role not found");
          return;
        }

        const role = userSnap.data().role;

        alert("Login successful");

        if (role === "company") {
          window.location.href = "company.html";
        } else if (role === "auditor") {
          window.location.href = "auditor.html";
        } else {
          window.location.href = "public.html";
        }

      } catch (error) {
        alert("Login failed: " + error.message);
      }
    });
  }

  // ================= METAMASK LOGIN =================
  const metamaskBtn = document.getElementById("metamaskLogin");

  if (metamaskBtn && window.ethereum) {
    metamaskBtn.addEventListener("click", async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const walletAddress = accounts[0];

        const provider =
          new window.ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const message = "Login to CarbonTrack";
        const signature = await signer.signMessage(message);

        const recovered =
          window.ethers.utils.verifyMessage(message, signature);

        if (
          recovered.toLowerCase() !== walletAddress.toLowerCase()
        ) {
          throw new Error("Signature verification failed");
        }

        alert("MetaMask login successful");
        window.location.href = "company.html";

      } catch (error) {
        console.error(error);
        alert("MetaMask login failed");
      }
    });
  }

});
