//import nessecary modules
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

//Set port
const port = process.env.PORT || 3000

//Import auth, buyer and seller modules
const task_routes = require('./routes/task')
const project_routes = require('./routes/project')
const user_routes = require('./routes/user')
const db = require('./db')

//Set app to use above modules
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })) // support encoded bodies
app.use(
    cors({
        credentials: true,
        origin: 'https://task-manager-frontend-p5c4.onrender.com',
    })
)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//Set patch to auth, buyer and seller
app.use('/task', task_routes)
app.use('/project', project_routes)
app.use('/user', user_routes)

//Start app,listen on port 3030
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
