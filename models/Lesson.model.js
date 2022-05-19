const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const lessonSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["TO LEARN", "LEARNING", "LEARNED"],
    default: "TO LEARN",
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // reachDate: {
  //   type: Date,
  // },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
  },
});

module.exports = model("Lesson", lessonSchema);
