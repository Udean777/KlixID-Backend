import mongoose from "mongoose";

const showTimeSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  theater: {
    type: String,
    required: true,
    trim: true,
  },
  screenType: {
    type: String,
    enum: ["2D", "3D", "IMAX", "4DX"],
    default: "2D",
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSeat: {
    type: Number,
    required: true,
    min: 1,
  },
  availableSeat: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

showTimeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

showTimeSchema.virtual("isFull").get(function () {
  return this.availableSeat === 0;
});

const ShowTime = mongoose.model("ShowTime", showTimeSchema);

export default ShowTime;
