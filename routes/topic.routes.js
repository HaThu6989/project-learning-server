const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const Topic = require("../models/Topic.model");
const Lesson = require("../models/Lesson.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// Create new topic
router.post("/topics", isAuthenticated, (req, res, next) => {
  const { title, description } = req.body;

  const newTopic = {
    title,
    description,
    lessons: [],
    user: req.payload._id,
  };

  console.log("newTopic............", newTopic);
  Topic.create(newTopic)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("error creating a new topic", err);
      res.status(500).json({
        message: "error creating a new topic",
        error: err,
      });
    });
});

// Get list of topics
router.get("/topics", isAuthenticated, (req, res, next) => {
  Topic.find({ user: req.payload._id })
    .populate("user")
    .populate("lessons")
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of topics", err);
      res.status(500).json({
        message: "error getting list of topics",
        error: err,
      });
    });
});

//  Get details of a specific topic by id
router.get("/topics/:topicId", isAuthenticated, (req, res, next) => {
  const { topicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Topic.findById(topicId)
    .populate("lessons")
    .then((topic) => res.json(topic))
    .catch((err) => {
      console.log("error getting details of a topic", err);
      res.status(500).json({
        message: "error getting details of a topic",
        error: err,
      });
    });
});

// Updates a specific topic by id
router.put("/topics/:topicId", isAuthenticated, (req, res, next) => {
  const { topicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Topic.findByIdAndUpdate(topicId, req.body, { new: true })
    .populate("lessons")
    .then((updatedTopic) => res.json(updatedTopic))
    .catch((err) => {
      console.log("error updating topic", err);
      res.status(500).json({
        message: "error updating topic",
        error: err,
      });
    });
});

// Delete a specific topic by id
router.delete("/topics/:topicId", isAuthenticated, (req, res, next) => {
  const { topicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(topicId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Topic.findByIdAndRemove(topicId)
    .then((deteletedTopic) => {
      return Lesson.deleteMany({ _id: { $in: deteletedTopic.lessons } });
    })
    .then(() =>
      res.json({
        message: `Topic with id ${topicId} & all associated lessons were removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("error deleting topic", err);
      res.status(500).json({
        message: "error deleting topic",
        error: err,
      });
    });
});

module.exports = router;
