const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["TO LEARN", "LEARNING", "LEARNED"],
    default: "TO LEARN",
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Lesson", lessonSchema);
