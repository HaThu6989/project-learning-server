const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const topicSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 20,
  },
  description: String,
  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Topic", topicSchema);
