import { Uploader } from "../../../system/core/Disk";

export function attachmentUpload(distination: string = "attachments") {
  return function (req, res, next) {
    const upload = Uploader.upload(
      distination,
      ["image/jpeg", "image/jpg", "image/png"],
      1000000,
      2,
      "Only .jpg, jpeg or .png format allowed!"
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
      } else {
        next();
      }
    });
  };
}
