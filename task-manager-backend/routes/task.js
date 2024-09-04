const express = require("express");
const router = express.Router();
const TaskModel = require("../schema/task");
const Project = require("../schema/project");


require("dotenv").config();

router.get("/getProjectTasks/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await TaskModel.find({ projectId: projectId });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//need to fix --Akash
router.get("/getUserTasks/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const tasks = await TaskModel.find({
      $or: [
        { assignee: user }, // Assignee is user
        { assignedTo: user }, // User is in the assignedTo array
      ],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTask = new TaskModel({ ...req.body });
    
    const _id = newTask.projectId

    const projectExist = await Project.findOne({_id });

    if(!projectExist){
      return res.status(400).send({ message: 'Project DOES NOT EXIST' });
    }

    let users = projectExist.collaborators
    users.push(projectExist.creator)
    let taskUsers = newTask.assignedTo

    const allUsersPresent = taskUsers.every(user => users.includes(user));

    if(!allUsersPresent){
      return res.status(401).send({ message: 'Users in the project have changed' });
    }


    const insertedTask = await newTask.save();
    return res.status(201).json(insertedTask);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:taskId", async (req, res) => {
  try {
    const requestBody = req.body
    const _id = requestBody.projectID

    const projectExist = await Project.findOne({_id });

    if(!projectExist){
      return res.status(400).send({ message: 'Project DOES NOT EXIST' });
    }

    let users = projectExist.collaborators
    users.push(projectExist.creator)
    let taskUsers = requestBody.assignedTo

    const allUsersPresent = taskUsers.every(user => users.includes(user));

    if(!allUsersPresent){
      return res.status(401).send({ message: 'Users in the project have changed' });
    }


    const { taskId } = req.params;

    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: taskId },
      req.body,
      { new: true }
    );

    return res.status(201).json(updatedTask);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const deletedTask = await TaskModel.deleteOne({ _id: taskId });
    if (deletedTask.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/removeUserTasks/:projectId/:userId", async (req, res) => {
    console.log('debugging')
  try {
    const { projectId, userId } = req.params;
    console.log('here2')
    const result = await TaskModel.updateMany(
      { projectId:projectId },
      { $pull: { assignedTo:  userId  } }
    );
    console.log('here3')
    res.json({ message: "User removed from tasks successfully", result });
  } catch (error) {
    console.error("Error removing user from tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const deletedTask = await TaskModel.deleteMany({ projectId: projectId });
    if (deletedTask.deletedCount === 0) {
      return res.status(404).json({ error: "Tasks not found" });
    }
    return res.status(200).json({ message: "Tasks deleted successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/addUsers", async (req, res) => {});

router.put("/deleteUsers", async (req, res) => {});

module.exports = router;
