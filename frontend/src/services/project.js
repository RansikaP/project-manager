import axios from 'axios'
import Cookies from 'universal-cookie'
import toast from 'react-hot-toast'
import taskService from './task'

const baseUrl = import.meta.env.VITE_BACKEND_URL + 'project/'
const cookies = new Cookies()

const getMyProjects = async () => {
    const username = cookies.get('user')
    const requestUrl = baseUrl + 'myProjects/' + username
    try {
        const response = await axios.get(requestUrl)
        return response.data
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

const getProjectName = async (id) => {
    const requestUrl = baseUrl + 'getProj/' + id
    try {
        const response = await axios.get(requestUrl)
        return response.data[0].name
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

const getCollabProjects = async () => {
    const username = cookies.get('user')
    const requestUrl = baseUrl + 'collabProjects/' + username
    try {
        const response = await axios.get(requestUrl)
        return response.data
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

const deleteProject = async (projId) => {
    const requestUrl = baseUrl + 'delete/' + projId

    try {
        const taskIds = await taskService.getProjectTasks(projId)

        taskIds.forEach((task) => {
            taskService.deleteTask(task._id)
        })
        const response = await axios.delete(requestUrl)
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

const leaveProject = async (collab, projId) => {
    const requestUrl = baseUrl + 'removeCollaborator'
    const removeCollabObj = {
        id: projId,
        collab: collab,
    }
    try {
        const response = await axios.put(requestUrl, removeCollabObj)
    } catch (error) {
        console.error('Error occurred:', error)
    }
}

const createProject = async (title, desc) => {
    const username = cookies.get('user')
    const requestUrl = baseUrl
    const newProjectObj = {
        name: title,
        creator: username,
        description: desc,
    }
    try {
        const response = await axios.post(requestUrl, newProjectObj)
        return response.data
    } catch (error) {
        console.error('Error occurred during project creation:', error)
        if (error.response && error.response.status === 404) {
            toast.error('Create A Project With A UNIQUE Name')
        }
    }
}

const addCollaborator = async (creator, name, key) => {
    const collaborator = cookies.get('user')
    const requestUrl = baseUrl + 'addCollaborator'

    const requestBody = {
        creator: creator,
        name: name,
        key: key,
        collaborator: collaborator,
    }

    try {
        const response = await axios.put(requestUrl, requestBody)
        return response.data
    } catch (error) {
        console.error('Error occurred while adding user to project:', error)
    }
}

const removeCollaborators = async (projectId, collaborators) => {
    const requestUrl = baseUrl + 'removeCollaborators'
    const removeCollabObj = {
        id: projectId,
        collaborators: collaborators,
    }

    try {
        const response = await axios.put(requestUrl, removeCollabObj)
        return response.data
    } catch (error) {
        console.error('Error occurred during collaborator removal:', error)
    }
}

export default {
    getMyProjects,
    getCollabProjects,
    createProject,
    deleteProject,
    leaveProject,
    addCollaborator,
    removeCollaborators,
    getProjectName,
}
