import taskService from '../../services/task'
import moment from 'moment'
import projectService from "../../services/project";
const urgentTasks = async () => {
    const tasksJson = await taskService.getMyTasks()

    const tasksJsonWithName  = await Promise.all(
        tasksJson.map(async(task)=>{
            const projectName = await projectService.getProjectName(task.projectId);
            return {
              ...task,
              projectId: projectName
            };
          })
        )

    const tasksObject = Object.keys(tasksJsonWithName).map((i) => tasksJsonWithName[i])




    const filteredAndFormattedTasks = tasksObject
        .map((task) => ({
            name: task.title,
            Project: task.projectId ,
            date: moment(task.dueDate).utc().format('YYYY-MM-DD'),
        }))
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })
        .slice(0, 3)

    return filteredAndFormattedTasks
}

const upcomingTasks = async () => {
    const tasksJson = await taskService.getMyTasks()
    const tasksJsonWithName  = await Promise.all(
        tasksJson.map(async(task)=>{
            const projectName = await projectService.getProjectName(task.projectId);
            return {
              ...task,
              projectId: projectName
            };
          })
        )

    const tasksObject = Object.keys(tasksJsonWithName).map((i) => tasksJsonWithName[i])

    const oneMonthFromNow = moment().add(1, 'week')

    const filteredAndFormattedTasks = tasksObject
        .filter((task) => {
            const dueDate = moment(task.dueDate)
            return dueDate.isBefore(oneMonthFromNow)
        })
        .map((task) => ({
            name: task.title,
            Project: task.projectId,
            date: moment(task.dueDate).utc().format('YYYY-MM-DD'),
        }))
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })

    return filteredAndFormattedTasks
}

export default { upcomingTasks, urgentTasks }
