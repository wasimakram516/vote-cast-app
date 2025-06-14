import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    company: { type: String },

    eventHistory: [
      {
        business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
        count: { type: Number, default: 1 },
        lastInteraction: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Visitor || mongoose.model("Visitor", VisitorSchema);
