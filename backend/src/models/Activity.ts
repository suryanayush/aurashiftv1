import mongoose, { Schema, Document } from 'mongoose';

export type ActivityType = 
  | 'cigarette_consumed' 
  | 'gym_workout' 
  | 'healthy_meal' 
  | 'skin_care' 
  | 'social_event';

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  cigarette_consumed: -10,
  gym_workout: 5,
  healthy_meal: 3,
  skin_care: 2,
  social_event: 1,
};

export const ACTIVITY_CATEGORIES = {
  NEGATIVE: ['cigarette_consumed'],
  POSITIVE: ['gym_workout', 'healthy_meal', 'skin_care', 'social_event'],
} as const;

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: ActivityType;
  points: number;
  metadata?: {
    note?: string;
    location?: string;
    duration?: number;  
    intensity?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, 
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(ACTIVITY_POINTS),
    index: true,
  },
  points: {
    type: Number,
    required: false, // Will be set by pre-save middleware
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, type: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

activitySchema.pre('save', function(next) {
  // Always set points based on type
  if (this.type) {
    this.points = ACTIVITY_POINTS[this.type as ActivityType];
  }
  next();
});

activitySchema.methods.toJSON = function() {
  const activityObject = this.toObject();
  delete activityObject.__v;
  activityObject.id = activityObject._id;
  delete activityObject._id;
  return activityObject;
};

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
