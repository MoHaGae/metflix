const express = require("express");
const uploadFile = require("../middlewares/fileUploadMiddleware");
const {
    registFileInfo   
  } = require("../controllers/fileController");

const router = express.Router();

router.post("/:fileType", uploadFile, registFileInfo);

module.exports = router;