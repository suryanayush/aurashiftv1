import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { SmokingProfile } from '../types';

export interface IUser extends Document {
  displayName: string;
  email: string;
  password: string;
  smokingHistory?: SmokingProfile;
  onboardingCompleted: boolean;
  auraScore: number;
  cigarettesAvoided: number;
  totalMoneySaved: number;
  streakStartTime?: Date;
  lastSmoked?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const smokingProfileSchema = new Schema({
  yearsSmoked: {
    type: Number,
    required: true,
    min: 0,
  },
  cigarettesPerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  costPerPack: {
    type: Number,
    required: true,
    min: 0,
  },
  motivations: {
    type: [String],
    required: true,
    validate: {
      validator: function(motivations: string[]) {
        return motivations.length > 0;
      },
      message: 'At least one motivation is required'
    }
  },
}, { _id: false });

const userSchema = new Schema({
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [100, 'Display name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  smokingHistory: {
    type: smokingProfileSchema,
    required: false,
  },
  onboardingCompleted: {
    type: Boolean,
    default: false,
  },
  auraScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  cigarettesAvoided: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalMoneySaved: {
    type: Number,
    default: 0,
    min: 0,
  },
  streakStartTime: {
    type: Date,
    required: false,
  },
  lastSmoked: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

// Index for performance
userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Transform output to remove password and format _id
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  
  // Transform _id to id
  userObject.id = userObject._id;
  delete userObject._id;
  
  return userObject;
};

export const User = mongoose.model<IUser>('User', userSchema);
