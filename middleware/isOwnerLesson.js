const Lesson = require("../models/Lesson.model");

module.exports = (req, res, next) => {
  const { lessonId } = req.params;

  Lesson.findById({ _id: lessonId })
    .populate("user")
    .then((lessonFromDB) => {
      console.log("lessonFromDB", lessonFromDB);
      if (lessonFromDB.user._id == req.payload._id) {
        next();
      } else {
        res.status(401).json({ message: "user unauthorized" });
      }
    });
};
