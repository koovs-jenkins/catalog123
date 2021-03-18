export const sanitizeFile = (file, cb) => {
  let fileExts = ["png", "jpg", "jpeg", "csv", "xlsx"];
  let isAllowedExt = fileExts.includes(
    file.originalname.split(".")[1].toLowerCase()
  );
  let allowedTypes = [
    "text/csv",
    "image/jpeg",
    "image/png",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ];
  if (isAllowedExt && allowedTypes.indexOf(file.mimetype) > -1) {
    cb(null, true);
  } else {
    cb("Error: File type not allowed!");
  }
};
