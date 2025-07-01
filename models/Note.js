const mongoose = require('mongoose'); // ✅ REQUIRED at the top

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  password: {
    type: String, // hashed password (optional)
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
  
});

module.exports = mongoose.model('Note', noteSchema);
