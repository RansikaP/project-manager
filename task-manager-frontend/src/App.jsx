import './App.css'
import Sidebar from './Components/sidebar/Sidebar'
import Home from './Components/homepage/HomePage'
import Project from './Components/project/Project'
import Login from './Components/login/Login'
import Register from './Components/register/Register'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import Cookies from 'universal-cookie'
import Page from './Components/page/userPage'
import './index.css'

function App() {
    const checkUsernameExists = () => {
        const cookies = new Cookies()
        const username = cookies.get('user')
        return username !== null
    }

    const shouldDisplaySidebar = () => {
        return !['/login', '/register'].includes(location.pathname)
    }

    return (
        <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            checkUsernameExists() ? (
                                <Navigate to="/home" />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/home"
                        element={<Page component={Home} />}
                    />
                    <Route
                        path="/project/:projectId"
                        element={<Page component={Project} />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
                    />
                </Routes>
        </div>
    )
}

export default App
