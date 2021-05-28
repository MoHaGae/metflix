const express = require("express");
const {
  joinUser
  , loginUser
  , logoutUser
} = require("../controllers/userController");

const router = express.Router();

/**
 * 회원가입 요청처리
 */
router.post("/join", joinUser);

/**
 * 로그인 요청처리
 */
router.post("/login", loginUser);

/**
 * 로그아웃 요청처리
 */
router.get("/logout", logoutUser);

module.exports = router;
