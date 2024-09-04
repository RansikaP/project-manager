import TaskRow from "./TaskRow";
import "./tasktable.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSort } from "react-icons/fa";
const TaskTable = ({ tasks, onDelete, onEdit }) => {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  const sortTasks = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedArray = [...tasks].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortedTasks(sortedArray);
    setSortConfig({ key, direction });
  };
  return (
    <table className="tasktable">
      <thead>
        <tr>
          <th>Task Name</th>
          <th>Description</th>
          <th>Creator</th>
          <th>Assigned Users</th>
          <th>
            Due Date
            <FaSort onClick={() => sortTasks("dueDate")} />
          </th>
          <th>
            Status
            <FaSort onClick={() => sortTasks("status")} />
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedTasks.map((task, index) => (
          <TaskRow
            key={index}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
