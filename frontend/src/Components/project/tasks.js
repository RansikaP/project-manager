import taskService from '../../services/task'
import moment from 'moment'

const getProjectTasks = async (projectId) => {
    const tasksJson = await taskService.getProjectTasks(projectId)
    const tasksObject = Object.keys(tasksJson).map((i) => tasksJson[i])

    const formattedTasks = tasksObject.map((task) => ({
        id: task._id,
        projectId: task.projectId,
        name: task.title,
        description: task.description,
        creator: task.assignee,
        assignedUsers: task.assignedTo,
        dueDate: moment(task.dueDate).utc().format('YYYY-MM-DD'),
        status: task.status,
    }))
    return formattedTasks
}

export default { getProjectTasks }
