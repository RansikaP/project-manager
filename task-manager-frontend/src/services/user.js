import axios from 'axios'

const baseUrl = import.meta.env.VITE_BACKEND_URL + 'user/'

const login = async (email, password) => {
    const requestUrl = baseUrl + 'login'
    const requestData = { email, password }
    try {
        const response = await axios.post(requestUrl, requestData)
        return response.data
    } catch (error) {
        console.error('Error occurred during login:', error)
    }
}

const register = async (email, password, name) => {
    const requestUrl = baseUrl + 'register'
    const requestData = { email, password, name }
    try {
        const reponse = await axios.post(requestUrl, requestData)
        return reponse.data
    } catch (error) {
        console.error('Error occurred during registration:', error)
    }
}

const getUserInfo = async (userId) => {
    const requestUrl = baseUrl + userId

    try {
        const response = await axios.get(requestUrl)
        return response.data
    } catch (error) {
        console.error('Error occured getting user informations')
    }
}

const getCollabUsers = async (collabs) => {
    let requestUrl = baseUrl

    if (!Array.isArray(collabs)) {
        console.error('collabs should be an array')
        return []
    }

    try {
        const userPromises = collabs.map((id) =>
            axios.get(`${requestUrl}${id}`).then((response) => response.data)
        )

        const users = await Promise.all(userPromises)
        return users
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

export default { login, register, getUserInfo, getCollabUsers }
