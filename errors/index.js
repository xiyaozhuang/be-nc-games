exports.handleCustomErrors = (err, req, res, next) => {
  console.log("CUSTOM ERROR:", err.status, err.msg);

  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  console.log("PSQL ERROR:", err.code);

  if (err.code === "42703") {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log("SERVER ERROR:", err);

  res.status(500).send({ msg: "Internal Server Error" });
};
