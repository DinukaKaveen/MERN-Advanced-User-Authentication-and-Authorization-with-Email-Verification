const express = require("express");
const router = express.Router();
const Task = require("../models/tasks");

// save task
router.post("/new_task", (req, res) => {
  const newTask = new Task(req.body);

  newTask
    .save()
    .then((result) => {
      console.log(result);
      return res.status(200).json({
        success: true,
        message: "Task Creating Success",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Task Creating Fail",
      });
    });
});

// get tasks
router.get("/view_tasks", (req, res) => {
  Task.find()
    .then((result) => {
      return res.status(200).json({
        success: true,
        tasks: result,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Tasks Loading Fail",
      });
    });
});

//get task by id
router.get("/get_task/:id", (req, res) => {
  const task_id = req.params.id;

  Task.findById(task_id)
    .then((result) => {
      return res.status(200).json({
        success: true,
        task: result,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Task Loading Fail",
      });
    });
});

// update task
router.put("/update_task/:id", (req, res) => {
  const task_id = req.params.id;

  Task.findByIdAndUpdate(task_id, { $set: req.body })
    .then((result) => {
      console.log(result);
      return res.status(200).json({
        success: true,
        message: "Task Updated Succefully",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Task Updated Fail",
      });
    });
});

// delete task
router.delete("/delete_task/:id", (req, res) => {
  const task_id = req.params.id;

  Task.findByIdAndDelete(task_id)
    .then((result) => {
      return res.status(200).json({
        success: true,
        deletedTask: result,
        message: "Delete Successfully",
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Delete Fail",
      });
    });
});

module.exports = router;
