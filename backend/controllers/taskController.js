import Task from '../models/Task.js';

// getTasks (koi badlaav nahin)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// createTask (koi badlaav nahin)
const createTask = async (req, res) => {
  const { name, date, status } = req.body;
  if (!name || !date) {
    return res.status(400).json({ message: 'Please provide name and date' });
  }
  try {
    const task = new Task({
      name,
      date,
      status: status || 'Pending',
      user: req.user._id,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- YEH HAI NAYA UPDATE FUNCTION ---
/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const { status, name, date } = req.body;

    // Ek object banayein jisme sirf woh data ho jo update karna hai
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (date !== undefined) updateData.date = date;
    if (status !== undefined) updateData.status = status;

    // Agar update karne ke liye kuch nahin bheja, toh error dein
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    // Task ko dhoondhein aur update karein (ek hi command mein)
    // new: true ka matlab hai ki humein naya (updated) task waapis milega
    const updatedTask = await Task.findOneAndUpdate(
      { 
        _id: req.params.id,       // Task ID yeh honi chahiye
        user: req.user._id        // Aur user ID aapki honi chahiye (Security)
      }, 
      { $set: updateData },    // Yeh data update karna hai
      { new: true }            // Hamein naya, updated task waapis chahiye
    );

    // Agar task nahin mila (ya woh aapka nahin tha)
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or user not authorized' });
    }

    // Safalta (Success)
    res.json(updatedTask);

  } catch (error) {
    // Agar ID galat format mein hai (jaise 'undefined')
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// --- END NAYA UPDATE FUNCTION ---

// deleteTask (koi badlaav nahin, 404 typo fixed)
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getTasks, createTask, updateTask, deleteTask };

