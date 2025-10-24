import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  // 'user' links this task to a User. This is critical for security.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // 'name' matches our frontend
  name: {
    type: String,
    required: true,
  },
  // 'date' matches our frontend (PDF calls it 'due_date')
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Not Done', 'Done'],
    default: 'Pending',
  },
  // These fields are from your PDF requirements
  description: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  attached_documents: [
    {
      type: String, // Will store URLs or file paths
    },
  ],
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

export default Task;