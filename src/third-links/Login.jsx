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
        sud(prev => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (userdata.email && userdata.password) {
            try {
                // Firebase login — no localhost needed ✅
                await signInWithEmailAndPassword(auth, userdata.email, userdata.password);

                toast("Login successful", { position: "top-right", autoClose: 2000 });
                navigate("/");

            } catch (error) {
                toast(error.message, { position: "top-right" });
            }
        }
    };

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
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <p>Don't have an account?
                            <Link className="btn btn-secondary ms-2" to="/Register">Register</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}