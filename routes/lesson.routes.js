const router = require("express").Router();
const mongoose = require("mongoose");

const Topic = require("../models/Topic.model");
const Lesson = require("../models/Lesson.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//  Create a new lesson
router.post("/lessons", (req, res, next) => {
  const { title, description, url, status, topicId } = req.body;

  const newLesson = {
    title,
    description,
    url: url.startsWith("https://") ? url : `https://${url}`,
    status: status || "TO LEARN",
    topic: topicId,
  };

  Lesson.create(newLesson)
    .then((lessonFromDB) => {
      console.log(lessonFromDB._id);
      return Topic.findByIdAndUpdate(topicId, {
        $push: { lessons: lessonFromDB._id },
      });
    })
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => res.json(err));
});

// Get list of lessons
router.get("/lessons", (req, res, next) => {
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
router.get("/lessons/:lessonId", (req, res, next) => {
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
});

// Updates a specific lesson by id
router.put("/lessons/:lessonId", (req, res, next) => {
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
});

// Delete a specific lesson by id
router.delete("/lessons/:lessonId", (req, res, next) => {
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
