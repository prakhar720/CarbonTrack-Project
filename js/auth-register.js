import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { doc, setDoc }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", async () => {
  const orgName = document.getElementById("orgName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!orgName || !email || !password || !role) {
    alert("Please fill all fields");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCred.user.uid), {
      orgName,
      email,
      role,
      createdAt: Date.now()
    });

    alert("Registration successful. Please login.");
    window.location.href = "login.html";

  } catch (error) {
    alert(error.message);
  }
});
