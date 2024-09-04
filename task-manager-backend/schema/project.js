const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    creator: { 
        type: String, 
        required: true
    },
    description: { 
        type: String 
    },
    collaborators: {
        type: [{ type: String }]
    }
},
    { collection: 'project-data' }
);

const ProjectModel = model('Project', ProjectSchema);

module.exports = ProjectModel;