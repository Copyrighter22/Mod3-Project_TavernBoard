const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
// @desc    Esquema de Mongoose para la entidad Usuario
// -----------------------------------------------------------------------------
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/kro9urjy/image/upload/v1785263289/samples/chair.png",
    },
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

module.exports = mongoose.model("User", userSchema);
