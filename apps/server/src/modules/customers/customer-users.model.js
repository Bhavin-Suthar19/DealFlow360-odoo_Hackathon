import mongoose from 'mongoose';
import crypto from 'crypto';

const customerUserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    customer_id: { type: String, ref: 'Customer', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    auth_token: { type: String, default: null },
    password_hash: { type: String, default: null }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

customerUserSchema.virtual('id').get(function () {
  return this._id;
});

export const CustomerUser = mongoose.models.CustomerUser || mongoose.model('CustomerUser', customerUserSchema);
export default CustomerUser;
