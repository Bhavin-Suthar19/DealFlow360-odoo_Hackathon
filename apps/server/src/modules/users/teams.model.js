import mongoose from 'mongoose';
import crypto from 'crypto';

const teamSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, trim: true },
    manager_id: { type: String, ref: 'User', required: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

teamSchema.virtual('id').get(function () {
  return this._id;
});

export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export default Team;
