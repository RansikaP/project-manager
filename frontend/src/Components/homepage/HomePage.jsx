import { useEffect, useState } from 'react'
import './HomePage.css'
import Cookies from 'universal-cookie'
import fetchTasks from './Data'
import projectService from '../../services/project'
import { useNavigate } from 'react-router-dom'

function Home(props) {
    const { reloadSidebar } = props
    const [projectName, setProjectName] = useState('')
    const [projectCreator, setProjectCreator] = useState('')
    const [projectKey, setProjectKey] = useState('')

    const [projectTitle, setProjectTitle] = useState('')
    const [projectDescription, setProjectDescription] = useState('')

    const [urgentTasks, setUrgentTasks] = useState([])
    const [upcomingTasks, setUpcomingTasks] = useState([])

    const cookies = new Cookies()
    const username = cookies.get('user name')

    const navigateTo = useNavigate()

    useEffect(() => {
        const getData = async () => {
            const upcomingData = await fetchTasks.upcomingTasks()
            const urgentData = await fetchTasks.urgentTasks()
            setUpcomingTasks(upcomingData)
            setUrgentTasks(urgentData)
        }
        getData()
    }, [])

    const handleName = (event) => {
        setProjectName(event.target.value)
    }

    const handleKey = (event) => {
        setProjectKey(event.target.value)
    }

    const handleCreator = (event) => {
        setProjectCreator(event.target.value)
    }

    const handleTitle = (event) => {
        setProjectTitle(event.target.value)
    }

    const handleDescription = (event) => {
        setProjectDescription(event.target.value)
    }

    const handleProjectSubmit = async (event) => {
        event.preventDefault()
        await projectService.createProject(projectTitle, projectDescription)
        setProjectTitle('')
        setProjectDescription('')
        reloadSidebar()
    }

    const handleJoinSubmit = (event) => {
        event.preventDefault()

        projectService
            .addCollaborator(projectCreator, projectName, projectKey)
            .then((response) => {
                setProjectCreator('')
                setProjectKey('')
                setProjectName('')
                reloadSidebar()
            })
    }

    const Logout = () => {
        cookies.remove('user')
        cookies.remove('jwt_authorization')
        cookies.remove('user name')
        setProjectName('')
        setProjectCreator('')
        setProjectTitle('')
        setProjectDescription('')
        setUrgentTasks([])
        setUpcomingTasks([])
        navigateTo('/login')
    }

    return (
        <div className="HomePagecontainer">
            <h1>Welcome {username}</h1>
            <div className="main-content">
                <div className="tasks-container">
                    <h2 className="label1-color">Tasks Due Soon!!!</h2>
                    <div className="cards">
                        {urgentTasks.map((task, i) => (
                            <div
                                key={i}
                                className="card"
                            >
                                <h3>Task: {task.name}</h3>
                                <h4>Project: {task.Project}</h4>
                                <h5>Due Date: {task.date}</h5>
                            </div>
                        ))}
                    </div>

                    <h2 className="label2-color">Tasks Due This Week</h2>
                    <div className="cards">
                        {upcomingTasks.map((task, i) => (
                            <div
                                key={i}
                                className="cardUpcoming"
                            >
                                <h3>Task: {task.name}</h3>
                                <h4>Project: {task.Project}</h4>
                                <p>Due Date: {task.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="formscontainer">
                <button
                    className="btn btn-danger btn-lg mb-2 p-0 m-0 fw-bold"
                    onClick={() => Logout()}
                >
                    Logout
                </button>
                <div className="form-box">
                    <form onSubmit={handleProjectSubmit}>
                        <label>Create A New Project</label>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={projectTitle}
                                onChange={handleTitle}
                            />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                value={projectDescription}
                                onChange={handleDescription}
                            />
                        </label>
                        <input
                            type="submit"
                            value="Submit"
                        />
                    </form>
                </div>
                <div className="form-box">
                    <form onSubmit={handleJoinSubmit}>
                        <label>Join An Existing Project</label>
                        <label>
                            Creator:
                            <input
                                type="text"
                                value={projectCreator}
                                onChange={handleCreator}
                            />
                        </label>
                        <label>
                            Project Name:
                            <input
                                type="text"
                                value={projectName}
                                onChange={handleName}
                            />
                        </label>
                        <label>
                            Project Key:
                            <input
                                type="password"
                                value={projectKey}
                                onChange={handleKey}
                            />
                        </label>
                        <input
                            type="submit"
                            value="Submit"
                        />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Home
