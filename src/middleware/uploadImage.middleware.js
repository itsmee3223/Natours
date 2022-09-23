const multer = require("multer");
const multerStorage = require("multer").memoryStorage();
const sharp = require("sharp");

const asyncHandler = require("./async");
const { BadRequestError } = require("../utils/errors");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.uploadUserPhoto = upload.single("photo");

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeImages = asyncHandler(async (req, res, next) => {
  if (!req.file && !req.files) return next();

  if (req.files) {
    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      })
    );

    return next();
  }

  if (req.file) {
    console.log(req.file.filename);
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    return next();
  }
});
