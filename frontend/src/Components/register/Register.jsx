import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock, FaAddressCard } from 'react-icons/fa'
import userService from '../../services/user'
import Cookies from 'universal-cookie'
import { jwtDecode } from 'jwt-decode'

const Register = () => {
    const cookies = new Cookies()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleName = (event) => {
        setName(event.target.value)
    }

    const registerEvent = () => {
        event.preventDefault()
        userService.register(username, password, name).then((response) => {
            const jwt_token = jwtDecode(response.accessToken)
            cookies.set('jwt_authorization', jwt_token, {
                expires: new Date(jwt_token.exp * 1000),
                sameSite: 'None',
                secure: true,
            })
            cookies.set('user', jwt_token.aud, {
                expires: new Date(jwt_token.exp * 1000),
                sameSite: 'None',
                secure: true,
            })

            if (
                cookies.get('user') !== null &&
                cookies.get('jwt_authorization') !== null
            ) {
                navigate('/home')
            }
        })
    }

    return (
        <div className="wrapper">
            <form onSubmit={registerEvent}>
                <h1>Register</h1>
                <div className="input-box">
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsername}
                        placeholder="Username"
                        required
                    />
                    <FaUser className="icon" />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        value={password}
                        onChange={handlePassword}
                        placeholder="Password"
                        required
                    />
                    <FaLock className="icon" />
                </div>

                <div className="input-box">
                    <input
                        type="name"
                        value={name}
                        onChange={handleName}
                        placeholder="Name"
                        required
                    />
                    <FaAddressCard className="icon" />
                </div>

                <button
                    type="submit"
                    className="btn"
                >
                    Register
                </button>

                <div className="register-link">
                    <p>
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Register
