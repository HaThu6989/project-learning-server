const Topic = require("../models/Topic.model");

module.exports = (req, res, next) => {
  const { topicId } = req.params;

  Topic.findById(topicId)
    .populate("user")
    .then((topicFromDB) => {
      if (topicFromDB.user._id == req.payload._id) {
        next();
      } else {
        res.status(401).json({ message: "user unauthorized" });
      }
    });
};
