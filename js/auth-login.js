import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    // 1. Login user
    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCred.user.uid;

    // 2. Fetch user role from Firestore
    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      alert("User role not found");
      return;
    }

    const role = userDoc.data().role;

    // 3. Redirect based on role
    if (role === "company") {
      window.location.href = "company.html";
    } 
    else if (role === "auditor") {
      window.location.href = "auditor.html";
    } 
    else {
      window.location.href = "public.html";
    }

  } catch (error) {
    alert("Login failed: " + error.message);
  }
});
