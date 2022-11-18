const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => seed(data));
afterAll(() => connection.end());

describe("/not-an-endpoint", () => {
  describe("errors", () => {
    test("GET:404 sends an appropriate error message when given an invalid endpoint", () => {
      return request(app)
        .get("/not-an-endpoint")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
  });
});

describe("/api/categories", () => {
  describe("requests", () => {
    test("GET:200 sends an array of categories to the client", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((res) => {
          expect(res.body.categories.length).toBe(data.categoryData.length);

          res.body.categories.forEach((category) => {
            expect(category).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("/api/reviews", () => {
  describe("requests", () => {
    test("GET:200 sends an array of reviews to the client, sorted by descending date", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews.length).toBe(data.reviewData.length);

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

    test("GET:200 sends an array of reviews to the client, filtered by category", () => {
      const category = "children's games";

      return request(app)
        .get(`/api/reviews?category=${category}`)
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
              category: category,
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    test("GET:200 sends an array of sorted reviews to the client", () => {
      const sort_by = "comment_count";

      return request(app)
        .get(`/api/reviews?sort_by=${sort_by}`)
        .expect(200)
        .then((res) => {
          expect(res.body.reviews.length).toBe(data.reviewData.length);

          expect(res.body.reviews).toBeSortedBy(sort_by);

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

    test("GET:200 sends an array of ordered reviews to the client", () => {
      const order = "ASC";

      return request(app)
        .get(`/api/reviews?order=${order}`)
        .expect(200)
        .then((res) => {
          expect(res.body.reviews.length).toBe(data.reviewData.length);

          expect(res.body.reviews).toBeSortedBy("created_at", {
            descending: order === "DESC" ? true : false,
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

    test("GET:200 sends an array of filtered, sorted and ordered reviews to the client", () => {
      const category = "social deduction";
      const sort_by = "votes";
      const order = "DESC";

      return request(app)
        .get(
          `/api/reviews?category=${category}&sort_by=${sort_by}&order=${order}`
        )
        .expect(200)
        .then((res) => {
          expect(res.body.reviews).toBeSortedBy(sort_by, {
            descending: order === "DESC" ? true : false,
          });

          res.body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: category,
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

  describe("errors", () => {
    test("GET:400 sends an appropriate error message when given an invalid category query", () => {
      const category = "test";

      return request(app)
        .get(`/api/reviews?category=${category}`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("invalid category query");
        });
    });

    test("GET:400 sends an appropriate error message when given an invalid sort query", () => {
      const sort_by = "test";

      return request(app)
        .get(`/api/reviews?sort_by=${sort_by}`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("invalid sort query");
        });
    });

    test("GET:400 sends an appropriate error message when given an invalid order query", () => {
      const order = "test";

      return request(app)
        .get(`/api/reviews?order=${order}`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("invalid order query");
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("requests", () => {
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
            comment_count: expect.any(String),
          });
        });
    });

    test("PATCH:200 updates the number of votes on a review and responds with the updated review", () => {
      const reviewVotesUpdate = {
        inc_votes: 1,
      };
      const review_id = 1;

      return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(reviewVotesUpdate)
        .expect(200)
        .then((res) => {
          expect(res.body.review).toMatchObject({
            review_id: review_id,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes:
              data.reviewData[review_id - 1].votes +
              reviewVotesUpdate.inc_votes,
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          });
        });
    });
  });

  describe("errors", () => {
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

    test("PATCH:400 sends an appropriate error message when given a bad update", () => {
      const reviewVotesUpdate = {
        inc_votes: "test",
      };

      return request(app)
        .patch("/api/reviews/1")
        .send(reviewVotesUpdate)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("PATCH:404 sends an appropriate error message when given a valid but non-existent id", () => {
      const reviewVotesUpdate = {
        inc_votes: 1,
      };

      return request(app)
        .patch("/api/reviews/999")
        .send(reviewVotesUpdate)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("review does not exist");
        });
    });

    test("PATCH:400 sends an appropriate error message when given an invalid id", () => {
      const reviewVotesUpdate = {
        inc_votes: 1,
      };

      return request(app)
        .patch("/api/reviews/not-a-review")
        .send(reviewVotesUpdate)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id");
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("requests", () => {
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

    test("POST:201 inserts a new comment to the db and sends the new comment back to the client", () => {
      const newComment = {
        username: "mallionaire",
        body: "testBody",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(201)
        .then((res) => {
          expect(res.body.comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "testBody",
            votes: 0,
            author: "mallionaire",
            review_id: 1,
            created_at: expect.any(String),
          });
        });
    });
  });

  describe("errors", () => {
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

    test("POST:404 sends an appropriate error message when given a non-existent username", () => {
      const newComment = {
        username: "testUser",
        body: "testBody",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });

    test("POST:400 sends an appropriate error message when given a bad comment", () => {
      const newComment = {
        body: "testBody",
      };

      return request(app)
        .post("/api/reviews/1/comments")
        .send(newComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });

    test("POST:404 sends an appropriate error message when given a valid but non-existent id", () => {
      const newComment = {
        username: "mallionaire",
        body: "testBody",
      };

      return request(app)
        .post("/api/reviews/999/comments")
        .send(newComment)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });

    test("POST:400 sends an appropriate error message when given an invalid id", () => {
      const newComment = {
        username: "mallionaire",
        body: "testBody",
      };

      return request(app)
        .post("/api/reviews/not-a-review/comments")
        .send(newComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid Id");
        });
    });
  });
});

describe("/api/users", () => {
  describe("requests", () => {
    test("GET:200 sends an array of users to the client", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((res) => {
          expect(res.body.users.length).toBe(data.userData.length);

          res.body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});
