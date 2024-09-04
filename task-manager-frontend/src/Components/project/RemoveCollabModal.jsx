import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

const RemoveCollaboratorModal = ({ show, handleRemove, handleRemoveClose, users = [] }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleUserChange = (selectedOptions) => {
        const selectedUsers = selectedOptions
            ? selectedOptions.map((option) => option.value)
            : [];
        setSelectedUsers(selectedUsers);
    };

    const handleRemoveClick = () => {
        handleRemove(selectedUsers);
        handleRemoveClose();
    };

    // Ensure users is an array
    const userOptions = users.map((user) => ({
        value: user._id,
        label: `${user.name} (${user.email})`
    }));

    return (
        <Modal
            show={show}
            onHide={handleRemoveClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>Remove Collaborators</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Collaborators List</Form.Label>
                        <Select
                            isMulti
                            name="assignedUsers"
                            onChange={handleUserChange}
                            options={userOptions}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleRemoveClose}
                >
                    Close
                </Button>
                <Button
                    variant="danger"
                    onClick={handleRemoveClick}
                >
                    Remove Collaborators
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RemoveCollaboratorModal;