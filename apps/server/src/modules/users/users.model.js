import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'sales_rep', 'sales_manager', 'finance_ops', 'admin'],
      required: true,
      index: true
    },
    team_id: { type: String, ref: 'Team', default: null },
    customer_id: { type: String, ref: 'Customer', default: null },
    department: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual('id').get(function () {
  return this._id;
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
