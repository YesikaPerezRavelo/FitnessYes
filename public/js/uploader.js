const form = document.getElementById("uploadForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userId = document.getElementById("userId").dataset.userId;

  try {
    const response = await fetch(`/api/users/${userId}/documents`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      Swal.fire({
        title: "Documents uploaded successfully",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error uploading documents",
        text: "Please try again",
        icon: "error",
      });
    }
  } catch (error) {
    console.error(error);
  }
});
