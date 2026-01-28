// get button
const openBtn = document.getElementById("openFormBtn");

// get form section
const formSection = document.getElementById("reportFormSection");

// when button is clicked
openBtn.addEventListener("click", () => {
  formSection.classList.remove("hidden"); // show form
  openBtn.style.display = "none";         // hide button
});
