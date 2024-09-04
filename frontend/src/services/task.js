import axios from 'axios'
import Cookies from 'universal-cookie'
import toast from 'react-hot-toast'

const baseUrl = import.meta.env.VITE_BACKEND_URL + 'task/'
const cookies = new Cookies()

const getMyTasks = async () => {
    const username = cookies.get('user')
    const request = baseUrl + 'getUserTasks/' + username
    try {
        const response = await axios.get(request)
        return response.data
    } catch (error) {
        console.log('Error occured while retreving tasks:', error)
    }
}

const getProjectTasks = async (projectId) => {
    const request = baseUrl + 'getProjectTasks/' + projectId
    try {
        const response = await axios.get(request)
        return response.data
    } catch (error) {
        console.log('Error occured while retreving tasks:', error)
    }
}

const updateTask = async (id, task) => {
    const request = baseUrl + id
    try {
        const response = await axios.put(request, task)
        return response
    } catch (error) {
        console.log('Error occured while updating task: ', error)
        if (error.response && error.response.status === 400) {
            toast.error('PROJECT DOES NOT EXIST ANYMORE! Leave Page')
        } else if (error.response && error.response.status === 401) {
            toast.error('Users in project have changed. Refresh Page')
        }
        if (error.response && error.response.status === 500) {
            toast.error('TASK NOT FOUND')
        }
    }
}

const deleteTask = async (id) => {
    const request = baseUrl + id
    try {
        const response = await axios.delete(request)
        return response
    } catch (error) {
        console.log('Error occured while deleting task: ', error)
        if (error.response && error.response.status === 404) {
            toast.error('TASK NOT FOUND. REFRESH PAGE')
        }
    }
}

const removeUserTasks = async (id, user) => {
    const request = baseUrl + 'removeUserTasks/' + id + '/' + user
    try {
        const response = await axios.put(request)
        return response
    } catch (error) {
        console.log('error')
    }
}

const addTask = async (task) => {
    const request = baseUrl
    try {
        const response = await axios.post(request, task)
        return response
    } catch (error) {
        console.log('Error occured while creating task: ', error)
        if (error.response && error.response.status === 400) {
            toast.error('Project DOES NOT EXIST! Leave Page')
        } else if (error.response && error.response.status === 401) {
            toast.error('Users in the project have changed. Refresh Page')
        }
    }
}

export default {
    getMyTasks,
    getProjectTasks,
    updateTask,
    deleteTask,
    addTask,
    removeUserTasks,
}
