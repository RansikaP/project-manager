const mongoose = require('mongoose')
const { Schema, model } = mongoose

// const taskSchema = new Schema({
//     taskId: { type: String, required: true },
//     name: { type: String, required: true },
//     description: { type: String },
// });

const TaskSchema = new Schema(
    {
        projectId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        assignee: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        assignedTo: {
            type: [{ type: String }],
            required: true,
        },
    },
    { collection: 'task-data' }
)

const TaskModel = model('Task', TaskSchema)

module.exports = TaskModel
