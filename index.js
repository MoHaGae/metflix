/**
 * module import
 */
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const connection = require("./config/databaseConfig.js");
const pool = require("./config/poolConfig")
const QUERY = require("./query/query.js");
const metflixConstant = require("./constant/metflixConstant");
const uploadFile = require("./middlewares/fileUploadMiddleware");
const log = require("./util/logger");

/**
 * express 세팅
 */
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "Ssok2as@$!ssds@#aaxcBP$sd",
    resave: false,
    saveUninitialized: false,
  })
);

/**
 * 회원가입 패이지 요청처리
 */
app.get("/join", (req, res) => {
  res.render("join");
});

/**
 * 회원가입 요청처리
 * @param id
 * @param password
 * @param nickname
 */
app.post("/user/join", (req, res) => {
  const { id, password, nickname } = req.body;

  // 유효성 검증
  // TODO express validation 적용
  if (
    !id ||
    !password ||
    !nickname ||
    id.trim().length <= 0 ||
    password.trim().length <= 0 ||
    nickname.trim().length <= 0
  ) {
    return res.render("join", {
      flashMessage: "회원정보를 정확히 입력해주세요.",
    });
  }

  //💾 유저정보를 데이터베이스에 저장
  connection.query(
    QUERY.USER.INSERT,
    [id, password, nickname, metflixConstant.USER_TYPE.NOMAL],
    (err) => {
      if (err) {
        console.error(err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.render("join", {
            flashMessage: "이미 가입된 아이디가 있습니다.",
          });
        }
        return res.render("join", {
          flashMessage: "회원가입에 실패했습니다.",
        });
      }
      return res.redirect("/login");
    }
  );
});

/**
 * 로그인 페이지 요청처리
 */
app.get("/login", (_, res) => {
  res.render("login");
});

/**
 * 로그인 요청처리
 */
app.post("/user/login", (req, res) => {
  const { id, password } = req.body;

  // 유효성 검증
  if (
    !id ||
    !password ||
    id.trim().length <= 0 ||
    password.trim().length <= 0
  ) {
    return res.render("login", {
      flashMessage: "로그인정보를 정확히 입력해주세요.",
    });
  }

  // 로그인 수행
  connection.query(QUERY.USER.SELECT_BY_ID, [id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.render("login", {
        flashMessage: "현재 서비스를 이용할 수 없습니다. 잠시후 시도해주세요.",
      });
    }
    const user = rows[0];
    log.debug(user, rows);
    if (!user || user.password !== password) {
      return res.render("login", {
        flashMessage: "로그인에 실패했습니다.",
      });
    }
    req.session.user = user;
    res.redirect("/");
  });
});

/**
 * 로그아웃 요청처리
 */
app.get("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/");
});

/**
 * 홈화면 요청처리
 */
app.get("/", (req, res) => {
  const { user } = req.session;
  res.render("home", { user });
});

/**
 * 파일 업로드
 */
app.post("/file/:fileType", uploadFile, async (req, res) => {
  log.info("==== File Upload Controller ====");
  log.debug("# Req File");
  console.dir(req.file);

  const { file } = req;
  const fileUrl = file.path;
  const fileType = req.params.fileType;
  const fileExtension = file.mimetype.split("/")[1];

  // 파일 삽입
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
});

app.listen(PORT, () => {
  log.info(`✅ Server Listen: http://localhost:${PORT}`);
});
