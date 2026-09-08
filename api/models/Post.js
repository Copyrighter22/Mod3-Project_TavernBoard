const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
// @desc    Esquema de Mongoose para la entidad Publicación (Post)
// -----------------------------------------------------------------------------
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tavern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tavern",
    },
    location: {
      name: { type: String, default: "" },
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [{ type: String }],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

module.exports = mongoose.model("Post", postSchema);
