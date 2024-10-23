const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    age: { type: Number, min: 10, max: 120 }, // Validate age
    gender: { type: String, enum: ["male", "female", "other"] },
    height: { type: Number }, // Height in cm
    weight: { type: Number }, // Weight in kg
    country: { type: String },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
    activityLevel: {type: String},
    workout: [{ type: mongoose.Schema.Types.ObjectId, ref: "Workout" }],
    nutrition: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nutrition" }],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    activationToken: { type: String },
    passwordResetToken: { type: String },
    resetTokenExpiration: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String },
    isProfileComplete: { type: Boolean, default: false },
    activityLevel: {type: String }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare the password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
