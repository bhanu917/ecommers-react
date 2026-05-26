import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';

export default function Login() {
    const [userdata, sud] = useState({
        email: "",
        password: "",
    });

    const sd = (e) => {
        const { name, value } = e.target;
        sud(prev => ({ ...prev, [name]: value }))
    }

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (userdata.email && userdata.password) {
            try {
                // step 1 - firebase login
                const userCredential = await signInWithEmailAndPassword(auth, userdata.email, userdata.password)
                const user = userCredential.user;

                // step 2 - fetch user from API using email
                const res = await fetch(`http://localhost:3006/Users?email=${userdata.email}`) // ✅ userdata.email not email
                const users = await res.json()
                console.log(users)        // is it an array?
                console.log(users[0])     // is first user correct?
                console.log(users[0].id)
                // step 3 - save to localStorage
                localStorage.setItem("userId", users[0].id)
                localStorage.setItem("userCart", JSON.stringify(users[0].cartprod))

                toast("login successful", { position: "top-right", autoClose: 2000 })
                navigate("/");

            } catch (error) {
                console.log(error.code);
                console.log(error.message);
                toast(error.message, { position: "top-right" });
            }
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <div className="card container" style={{ width: "400px" }}>
                <div className="card-title text-center">
                    <h2>Login</h2><hr />
                </div>
                <div className="card-body">
                    <form onSubmit={submit}>
                        <label>Email :</label><br />
                        <input type="email" name="email" value={userdata.email} onChange={sd} />
                        <br /><br />
                        <label>Password :</label><br />
                        <input type="password" name="password" value={userdata.password} onChange={sd} />
                        <br /><br />
                        <button type="submit" className="btn btn-primary">submit</button>
                        <p>don't have an account?
                            <Link className="btn btn-secondary ms-2" to="/Register">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}