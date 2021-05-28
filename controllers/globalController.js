/**
 * 홈화면 요청처리
 */
const getHomePage = (req, res) => {
  const { user } = req.session;
  res.render("home", { user });
};

/**
 * 로그인 페이지 요청처리
 */
const getLoginPage = (_, res) => {
  res.render("login");
};

/**
 * 회원가입 패이지 요청처리
 */
const getJoinPage = (_, res) => {
  res.render("join");
};

module.exports = {
  getHomePage
  , getLoginPage
  , getJoinPage
};
