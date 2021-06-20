const request = require("supertest");
const app = require("../index");

describe("파일 업로드 테스트", () => {
  /**
   * 이미지 업로드를 정상적을 수행한 케이스
   */
  test("이미지 업로드 성공", async () => {
    const res = await request(app)
      .post(`/file/IMAGE`)
      .type("multipart/form-data")
      .attach("uploadFile", "./test/resources/test-image.png");

    expect(res.statusCode).toBe(200);
  });

  /**
   * 다른 필드명으로 파일첨부한 케이스
   */
  test("다른 필드명으로 이미지 업로드", async () => {
    const res = await request(app)
      .post(`/file/IMAGE`)
      .type("multipart/form-data")
      .attach("file", "./test/resources/test-image.png");

    expect(res.statusCode).toBe(400);
  });

  /**
   * multipart/form-data가 아닌 Content Type으로 요청
   */
  test("application/json으로 업로드 시도", async () => {
    const res = await request(app)
      .post(`/file/IMAGE`)
      .type("json")
      .send({ uploadFile: "good~!" });
    expect(res.statusCode).toBe(406);
  });

  /**
   * 업로드시 파일을 업로드 하지않은 케이스
   */
  test("파일 첨부없이 업로드", async () => {
    const res = await request(app)
      .post(`/file/IMAGE`)
      .type("multipart/form-data");
    expect(res.statusCode).toBe(400);
  });

  /**
   * 비디오 업로드 시 지원하지 않는 파일 업로드
   */
  test("비디오 업로드시 이미지 업로드", async () => {
    const res = await request(app)
      .post(`/file/VIDEO`)
      .type("multipart/form-data")
      .attach("uploadFile", "./test/resources/test-image.png");
    expect(res.statusCode).toBe(415);
  });
});
