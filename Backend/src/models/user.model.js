import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

//schema=structure,models=code versions of structure of data
//so code version of schema is called as the models
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLength: 20,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 100, // Increased to accommodate hashed passwords
      select: false, // Don't return password by default in queries
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Total number of movies this user has picked so far
    totalMoviesPicked: {
      type: Number,
      default: 0,
    },
    // Last time the user logged in (used for greetings / analytics)
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // Used by the chatbot to decide which system prompt to use
    // true  => treat as new user (ask 3 setup questions)
    // false => returning user flow (personalized banter)
    isNewUser: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password before saving to database
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt with 10 rounds (more rounds = more secure but slower)
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//mongoose is talking to mongoDB and then extracts the userSchema

//here User is the user model like model for all users not a single users's
export const User = mongoose.model("User", userSchema);
