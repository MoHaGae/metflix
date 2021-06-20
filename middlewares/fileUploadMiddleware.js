/**
 * module import
 */
const multer = require("multer");
const log = require("../util/logger");

/**
 * 상수 선언
 */
const VIDEO_TYPE = "VIDEO";
const IMAGE_TYPE = "IMAGE";

/**
 * 파일 필터
 * @param {Request} req
 * @param {Express.Multer.File,} file
 * @param {multer.FileFilterCallback} cb
 */
const fileFilter = (req, file, cb) => {
  log.debug("==== File Fileter ====");

  const fileType = req.params.fileType;
  const mimeType = file.mimetype.split("/")[1];

  log.debug("fileType: " + fileType);
  log.debug("fileMimeType: " + mimeType);

  if (fileType === IMAGE_TYPE && !(mimeType === "jpg" || mimeType === "png")) {
    log.debug("이미지 아님!!!");
    log.debug("동영상 아님!!!");
    const error = new Error(
      `The Multipart MimeType: ${mimeType} is Not Support MideaType For Image`
    );
    error.name = "NotSupportMideaType";
    error.code = "NOT_SUPPORT_MIDEA_TYPE";
    cb(error);
  } else if (
    fileType === VIDEO_TYPE &&
    !(
      mimeType === "mp4" ||
      mimeType === "mkv" ||
      mimeType === "avi" ||
      mimeType === "ogg" ||
      mimeType === "flv"
    )
  ) {
    log.debug("동영상 아님!!!");
    const error = new Error(
      `The Multipart MimeType: ${mimeType} is Not Support MideaType For Video`
    );
    error.name = "NotSupportMideaType";
    error.code = "NOT_SUPPORT_MIDEA_TYPE";
    cb(error);
  }

  cb(null, true);
};

/**
 * multer 파일 업로드 설정
 */
const imageUpload = multer({ dest: "uploads/images", fileFilter }).single(
  "uploadFile"
);
const videoUpload = multer({ dest: "uploads/videos", fileFilter }).single(
  "uploadFile"
);

/**
 * 파일 업로드 미들웨어
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const uploadFile = (req, res, next) => {
  const fileType = req.params.fileType;
  const contentType = req.headers['content-type'];
  log.debug("==== Upload File MiddeleWare ====");
  log.debug(`File Type: ${fileType}`);
  log.debug(`Content Type : ${contentType}`);
  log.debug("# Req Body");
  console.dir(req.body);
  log.debug("# Req Param");
  console.dir(req.params);
  log.debug("# Req Header");
  console.dir(req.headers);

  // header 유효성 체크 
  if(!contentType || !contentType.startsWith("multipart/form-data") ) {
    return res.status(406).json({ result: "fail", errorMsg: `Not Support Content Type: ${contentType}`});
  }

  // 파일 업로드 후처리 함수
  const handleAfterUpload = (err) => {
    log.debug(`==== Image Upload Finished ====`);
    log.debug("# Req File");
    console.dir(req.file);
    log.debug("# Req Body");
    console.dir(req.body);

    /**
     * 파일 업로드 에러 처리
     */
    if (err instanceof multer.MulterError) {
      // Multer Error Handling
      
      /* 예상치 못한 필드명으로 파일이 들어온 경우 */
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ result: "fail", errorMsg: "Unexpected Param Name" });
      }
      log.error(err.code, err.name, err);
      return res.status(500).json({
        result: "fail",
        errName: err.name,
        errCode: err.code,
        errorMsg: err.message,
      });
    } else if (err) {
      // Other Error Handling

      if (err.code === "NOT_SUPPORT_MIDEA_TYPE") {
        return res.status(415).json({ result: "fail", errorMsg: err.message });
      } else if (err.message === "Multipart: Boundary not found") {
        return res.status(400).json({ result: "fail", errorMsg: err.message });
      }
      log.error(err.name, err);
      return res.status(500).json({
        result: "fail",
        errName: err.name,
        errorMsg: err.message,
      });
    }

    // 파일이 업로드 되지 못한 경우
    if (!req.file) {
      return res
        .status(400)
        .json({ result: "fail", errorMsg: "Not Selected File" });
    }
    next();
  };

  /**
   * file Type 유효성 검증 및 파일 업로드 처리
   */
  if (fileType === IMAGE_TYPE) {
    imageUpload(req, res, handleAfterUpload);
  } else if (fileType === VIDEO_TYPE) {
    videoUpload(req, res, handleAfterUpload);
  } else {
    res.status(400).json({ result: "fail", errorMsg: "Wrong File Type" });
  }
};

module.exports = uploadFile;
