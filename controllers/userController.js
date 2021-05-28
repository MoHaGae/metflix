/**
 * module import
 */
const QUERY = require("../query/query");
const connection = require("../config/databaseConfig.js");
const metflixConstant = require("../constant/metflixConstant");
const log = require("../util/logger");

/**
 * 회원가입 요청처리
 * @param req
 * @param res 
 */ 
const joinUser = (req, res) => {
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
};

/**
 * 로그인 요청처리
 */
const loginUser = (req, res) => {
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
};

/**
 * 로그아웃 요청처리
 */
const logoutUser = (req, res) => {
  delete req.session.user;
  res.redirect("/");
};


module.exports = {
    joinUser
    , loginUser
    , logoutUser
};