const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => connection.end());

describe("/api/not-an-endpoint", () => {
  test("GET:404 sends an appropriate error message when given an invalid endpoint", () => {
    return request(app)
      .get("/not-an-endpoint")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});

describe("/api/categories", () => {
  test("GET:200 sends an array of categories to the client", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        res.body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api/reviews", () => {
  test("GET:200 sends an array of reviews to the client, sorted by descending date ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });

        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET:200 sends a single review to the client", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review does not exist");
      });
  });

  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/not-a-review")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Id");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET:200 sends an array of comments for a given review_id to the client", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });

        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });

  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review does not exist");
      });
  });

  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/reviews/not-a-review/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Id");
      });
  });
});
