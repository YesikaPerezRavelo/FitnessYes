console.log("uploader.js loaded");

const form = document.getElementById("uploadForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const userIdElement = document.getElementById("userId");

  if (!userIdElement) {
    console.error("userId element not found");
    Swal.fire({
      title: "Error uploading documents",
      text: "User ID not found",
      icon: "error",
    });
    return;
  }

  const userId = userIdElement.value;
  console.log("User ID:", userId); // Add this line to log the user ID
  if (!userId) {
    console.error("userId not found");
    Swal.fire({
      title: "Error uploading documents",
      text: "User ID not provided",
      icon: "error",
    });
    return;
  }

  try {
    const response = await fetch(`/api/users/${userId}/documents`, {
      method: "POST",
      body: formData,
    });
    console.log("Response status:", response.status);
    if (response.ok) {
      Swal.fire({
        title: "Documents uploaded successfully",
        imageUrl:
          "https://yesikaperezravelo.github.io/FitnessPlanYes/img/i.webp",
      });
    } else {
      const errorText = await response.text();
      console.error("Error response text:", errorText);
      Swal.fire({
        title: "Error uploading documents",
        text: errorText || "Please try again",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    Swal.fire({
      title: "Error uploading documents",
      text: "Please try again",
      icon: "error",
    });
  }
});
