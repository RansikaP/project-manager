import { useState, useEffect } from 'react'
import Sidebar from '../sidebar/Sidebar'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import './userPage.css'
import Home from '../homepage/HomePage'
import { useParams } from "react-router-dom";
function Page(props) {
    const Component = props.component
    const user = Cookies.get('user')
    const navigateTo = useNavigate()

    const [reloadSidebar, setReloadSidebar] = useState(false)

    useEffect(() => {
        if (!user) {
            navigateTo('/login')
        }
    }, [])

    const handleSidebarReload = () => {
        setReloadSidebar((prevState) => !prevState) // Toggle reload state
    }

    return (
        <div className="PageContainer">
            {/* Reloaded Sidebar component */}
            <Sidebar key={reloadSidebar} />

            <div className="content">
                {/* Pass the handleSidebarReload function down to the form component */}
                <Component reloadSidebar={handleSidebarReload} />
            </div>
        </div>
    )
}

export default Page
