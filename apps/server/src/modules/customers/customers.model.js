import mongoose from 'mongoose';
import crypto from 'crypto';

const customerSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, trim: true },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      required: true,
      index: true
    },
    currency: { type: String, required: true, default: 'USD' }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

customerSchema.virtual('id').get(function () {
  return this._id;
});

export const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export default Customer;
