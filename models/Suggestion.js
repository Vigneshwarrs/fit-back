const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['food', 'workout'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);