const form = document.getElementById("role-switch-form");
const roleSelect = document.getElementById("role");
const uploadButton = document.getElementById("document-upload-button");

const rolesRequiringDocuments = ["premium"];

roleSelect.addEventListener("change", (e) => {
  const selectedRole = e.target.value;
  if (rolesRequiringDocuments.includes(selectedRole)) {
    uploadButton.style.display = "block";
  } else {
    uploadButton.style.display = "none";
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("role").dataset.userId;
  const newRole = document.getElementById("role").value;
  try {
    const response = await fetch(`/api/users/premium/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (response.ok) {
      Swal.fire({
        title: "Role updated successfully",
        imageUrl:
          "https://yesikaperezravelo.github.io/FitnessPlanYes/img/i.webp",
      });
      if (rolesRequiringDocuments.includes(newRole)) {
        uploadButton.style.display = "block";
      } else {
        uploadButton.style.display = "none";
      }
    } else {
      Swal.fire({
        title: "Error updating role",
        text: "Need to upload Documents",
        icon: "error",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

uploadButton.addEventListener("click", () => {
  window.location.href = "/documentsView";
});
