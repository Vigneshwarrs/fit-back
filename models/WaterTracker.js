const mongoose =  require('mongoose');

const waterEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  glassCount: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  goal: {
    type: Number,
    required: true,
    min: 1,
    max: 15
  },
  totalMilliliters: {
    type: Number,
    default: function() {
      return this.glassCount * 250; // Each glass is 250ml
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
waterEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('WaterEntry', waterEntrySchema);
