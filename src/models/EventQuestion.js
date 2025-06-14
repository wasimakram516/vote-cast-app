import mongoose from "mongoose";

const EventQuestionSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
    answered: { type: Boolean, default: false },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EventQuestion ||
  mongoose.model("EventQuestion", EventQuestionSchema);
