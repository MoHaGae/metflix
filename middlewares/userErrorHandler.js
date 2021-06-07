const userValidationErrorHandler = (err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    if(req.path === "/login") {
        res.render("login", {
            flashMessage: "로그인정보를 정확히 입력해주세요.",
          });
    } else if(req.path === "/join") {
        res.render("join", {
            flashMessage: "회원정보를 정확히 입력해주세요.",
          });
    } else {
        res.status(400).json({
          type: err.type, 
          message: err.error.toString(),
        });
    }
} else {
    // TODO pass on to another error handler
  }
};

module.exports = userValidationErrorHandler;