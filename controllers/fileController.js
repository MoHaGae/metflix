/**
 * module import
 */
 const QUERY = require("../query/query");
 const pool = require("../config/poolConfig.js");
 const metflixConstant = require("../constant/metflixConstant");
 const log = require("../util/logger");

const registFileInfo = async (req, res) => {
    log.info("==== File Upload Controller ====");
    log.debug("# Req File");
    console.dir(req.file);
  
    const { file } = req;
    const fileUrl = file.path;
    const fileType = req.params.fileType;
    const fileExtension = file.mimetype.split("/")[1];
  
    // 파일 정보 삽입
    try {
      const [result] = await pool.query(QUERY.FILE.INSERT, [
        fileExtension,
        fileUrl,
        fileType,
        metflixConstant.FILE_STATUS_TYPE.TEMP,
      ]);
      log.debug(result);
      console.count("file res");
      res.status(200).json({ result: "success", fileNo: result.insertId });
    } catch (error) {
      log.error(error);
      res
        .status(503)
        .json({ result: "fail", errorMsg: "서비스를 현재 이용할 수 없습니다." });
    }
  };

module.exports = {
    registFileInfo
};