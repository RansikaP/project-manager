const express = require("express");
const router = express.Router();
const Project = require("../schema/project");
require("dotenv").config();
const { default: mongoose } = require("mongoose");

router.post("/", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { name, creator, description, collaborators } = req.body;

    // Create a new project instance
    const project = new Project({
      name,
      creator,
      description,
      collaborators,
    });

    const existingProject = await Project.findOne({ creator, name });

    // If the project exists, add the collaborator to its collaborators array
    if (existingProject) {
      res.status(404).json({
        error: "Creator already has a proeject with this name.",
      });
    } else {
      const newProject = await project.save();
      res.status(201).json(newProject);
    }
  } catch (error) {
    // Handle errors
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;
    console.log("here");
    console.log(id);
    const query = { _id: id };

    const result = await Project.deleteOne(query); // Await the deleteOne() operation

    if (result.deletedCount === 1) {
      console.log("Successfully deleted one document.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }

    // Respond with the result of the delete operation
    res.status(200).json(result);
  } catch (error) {
    // Handle errors
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

router.put("/addCollaborator", async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);

    // Extract data from the request body
    const { creator, name, collaborator } = req.body;

    // Find the project with the same creator and name
    const project = await Project.findOne({ creator, name });

    // If the project exists, add the collaborator to its collaborators array
    if (project) {
      // Check if the collaborator is not already in the collaborators array
      if (!project.collaborators.includes(collaborator)) {
        project.collaborators.push(collaborator);
      } else {
        console.log("Collaborator already exists in the project.");
      }

      // Save the updated project to the database
      const updatedProject = await project.save();

      // Respond with the updated project
      res.status(200).json(updatedProject);
    } else {
      // If the project does not exist, respond with an error
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error adding collaborator:", error);
    res.status(500).json({ error: "Failed to add collaborator" });
  }
});

router.put("/", async (req, res) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);

    // Extract data from the request body
    const { creator, old_name, new_name, new_description } = req.body;

    const filter = { name: old_name, creator: creator };
    const update = { name: new_name, description: new_description };

    if (old_name == new_name) {
      const updatedProject = await Project.findOneAndUpdate(filter, update);
      return res.status(200).json(updatedProject);
    }

    const existingProject = await Project.findOne({
      creator,
      name: new_name,
    });
    if (existingProject) {
      return res.status(400).json({
        error: "Project with the same creator and new name already exists",
      });
    }

    const updatedProject = await Project.findOneAndUpdate(filter, update);

    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ error: "Project not found" });
    }
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res.status(500).json({ error: "Failed to add collaborator" });
  }
});

router.put("/removeCollaborators", async (req, res) => {
  try {
    const { id, collaborators } = req.body;
    const _id = id;
    const project = await Project.findOne({ _id });

    if (project) {
      project.collaborators = project.collaborators.filter(
        (collaborator) => !collaborators.includes(collaborator)
      );

      const updatedProject = await project.save();

      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({
        error: "Collaborator not found in the project",
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error removing collaborator:", error);
    res.status(500).json({ error: "Failed to remove collaborator" });
  }

});

router.put("/removeCollaborator", async (req, res) => {
  try {
    const { id, collab } = req.body;
    const _id = id;
    const project = await Project.findOne({ _id });

    if (project) {
      project.collaborators = project.collaborators.filter(
        (collaborator) => collaborator !== collab
      );

      const updatedProject = await project.save();


      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({
        error: "Project not found",
      });
    }
  } catch (error) {
    // Handle errors
    console.error("Error removing collaborator:", error);
    res.status(500).json({ error: "Failed to remove collaborator" });
  }
});




router.get("/collabProjects/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;

    const projects = await Project.find({ collaborators: id });

    res.status(200).json(projects);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user projects:", error);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
});

router.get("/myProjects/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;

    const projects = await Project.find({ creator: id });

    res.status(200).json(projects);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user projects:", error);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
});

router.get("/getProj/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const { id } = req.params;

    const projects = await Project.find({ _id: id });

    res.status(200).json(projects);
  } catch (error) {
    // Handle errors
    console.error("Error fetching user projects:", error);
    res.status(500).json({ error: "Failed to fetch user projects" });
  }
});

module.exports = router;
