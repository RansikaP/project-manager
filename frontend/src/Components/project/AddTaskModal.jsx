import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import Select from 'react-select'
import taskService from '../../services/task'
import Cookies from 'universal-cookie'

const AddTaskModal = ({ show, handleClose, handleSave, users=[], projectId }) => {
    const cookies = new Cookies()

    const [newTask, setNewTask] = useState({
        name: '',
        description: '',
        creator: 'Current User', // Adjust as needed to get the current user
        assignedUsers: [],
        dueDate: '',
        status: 'Not Started',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewTask({ ...newTask, [name]: value })
    }

    const handleUserChange = (selectedOptions) => {
        const selectedUsers = selectedOptions
            ? selectedOptions.map((option) => option.value)
            : []
        setNewTask({ ...newTask, assignedUsers: selectedUsers })
    }

    const handleSubmit = () => {
        const formattedNewTask = {
            projectId: projectId,
            title: newTask.name,
            description: newTask.description,
            assignee: cookies.get('user'),
            assignedTo: newTask.assignedUsers,
            dueDate: newTask.dueDate,
            status: newTask.status,
        }

        taskService
            .addTask(formattedNewTask)
            .then((response) => {
                const createdTask = response.data
                const updatedTask = {
                    ...newTask,
                    id: createdTask._id,
                    projectId: projectId,
                }

                if (response.status === 201) {
                    handleSave(updatedTask)
                } else {
                    console.error(
                        `Failed to delete task. Status code: ${response.status}`
                    )
                }

                setNewTask({
                    name: '',
                    description: '',
                    creator: 'Current User', // Adjust as needed to get the current user
                    assignedUsers: [],
                    dueDate: '',
                    status: 'Not Started',
                })
                handleClose()
            })
            .catch((error) => {
                console.error(error)
            })
    }

 
    // const userOptions = users.map((user) => ({ value: user, label: user }))
    const userOptions = users.map((user) => ({
        value: user._id,
        label: `${user.name} (${user.email})`
    }));
    return (
        <Modal
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Add New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={newTask.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={newTask.description}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Assigned Users</Form.Label>
                        <Select
                            isMulti
                            name="assignedUsers"
                            value={userOptions.filter((option) =>
                                newTask.assignedUsers.includes(option.value)
                            )}
                            onChange={handleUserChange}
                            options={userOptions}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Due Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="dueDate"
                            value={newTask.dueDate}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                            as="select"
                            name="status"
                            value={newTask.status}
                            onChange={handleChange}
                        >
                            <option>Not Started</option>
                            <option>In Progress</option>
                            <option>In Review</option>
                            <option>Completed</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                >
                    Add Task
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddTaskModal
