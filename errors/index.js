exports.handleInvalidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
};
