const router = require("express").Router();
const mongoose = require("mongoose");

const Topic = require("../models/Topic.model");
const Lesson = require("../models/Lesson.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");
const isOwnerLesson = require("../middleware/isOwnerLesson");
//  Create a new lesson
router.post("/lessons", isAuthenticated, (req, res, next) => {
  const { title, description, url, status, topic } = req.body;
  console.log("lesson created", req.body);
  let urlAddress;

  if (url?.startsWith("https://")) {
    urlAddress = url;
  } else {
    urlAddress = `https://${url}`;
  }

  const newLesson = {
    title,
    description,
    url: urlAddress,
    status: status || "TO LEARN",
    topic,
    user: req.payload._id,
  };

  Lesson.create(newLesson)
    .then((lessonFromDB) => {
      return Topic.findByIdAndUpdate(lessonFromDB.topic, {
        $push: { lessons: lessonFromDB._id },
      });
    })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => res.status(500).json(err));
});

// Get list of lessons
router.get("/lessons", isAuthenticated, (req, res, next) => {
  Lesson.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of lessons", err);
      res.status(500).json({
        message: "error getting list of lessons",
        error: err,
      });
    });
});

//  Get details of a specific lesson by id
router.get(
  "/lessons/:lessonId",
  isAuthenticated,
  isOwnerLesson,
  (req, res, next) => {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Lesson.findOne({ _id: lessonId })
      .then((lesson) => res.json(lesson))
      .catch((err) => {
        console.log("error getting details of a lesson", err);
        res.status(500).json({
          message: "error getting details of a lesson",
          error: err,
        });
      });
  }
);

// Updates a specific lesson by id
router.put(
  "/lessons/:lessonId",
  isAuthenticated,
  isOwnerLesson,
  (req, res, next) => {
    const { lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Lesson.findByIdAndUpdate({ _id: lessonId }, req.body, { new: true })
      .then((updatedLesson) => res.json(updatedLesson))
      .catch((err) => {
        console.log("error updating lesson", err);
        res.status(500).json({
          message: "error updating lesson",
          error: err,
        });
      });
  }
);

// Delete a specific lesson by id
router.delete("/lessons/:lessonId", isAuthenticated, (req, res, next) => {
  const { lessonId } = req.params;
  console.log(req.params);
  if (!mongoose.Types.ObjectId.isValid(lessonId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Lesson.findByIdAndRemove({ _id: lessonId })
    .then(() => {
      res.json({
        message: `lesson with id ${lessonId} & all associated lessons were removed successfully.`,
      });
    })
    .catch((err) => {
      console.log("error deleting lesson", err);
      res.status(500).json({
        message: "error deleting lesson",
        error: err,
      });
    });
});

module.exports = router;
