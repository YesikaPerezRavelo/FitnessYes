import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = "";

    if (file.fieldname === "documents") {
      destinationFolder = "documents";
    } else if (file.fieldname === "profileImage") {
      destinationFolder = "profiles";
    } else if (file.fieldname === "productImage") {
      destinationFolder = "products";
    }
    cb(null, `src/public/img/uploads/${destinationFolder}`);
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    // limit
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});

export const uploader = multer({ storage });
