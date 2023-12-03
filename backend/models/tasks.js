const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    taskName:{
        type: String,
        required: true
    },
    taskDescription:{
        type: String,
        required: true
    },
    addedDate:{
        type: Date,
        required: true
    },
    dueDate:{
        type: Date,
        required: true
    },
    priority:{
        type: String,
        required: true
    },
    taskStatus:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('tasks', taskSchema);