import mongoose from 'mongoose';

const pendingRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      minlength: [2, 'Group name must be at least 2 characters'],
      maxlength: [100, 'Group name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Group description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    tags: {
      type: [String],
      required: [true, 'At least one tag is required'],
      validate: {
        validator: function (tags) {
          return tags.length >= 1 && tags.length <= 5;
        },
        message: 'Group must have between 1 and 5 tags',
      },
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin ID is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pendingRequests: [pendingRequestSchema],
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for members count
groupSchema.virtual('membersCount').get(function () {
  return this.members.length;
});

// Ensure virtuals are included in JSON and Object
groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure admin is in members array
groupSchema.pre('save', function (next) {
  if (this.isNew && !this.members.includes(this.adminId)) {
    this.members.push(this.adminId);
  }
  next();
});

export const Group = mongoose.model('Group', groupSchema);
