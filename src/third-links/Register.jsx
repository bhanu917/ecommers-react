import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";

export default function Register() {
    const [userdata, sud] = useState({
        name: "",
        email: "",
        password: "",
        repassword: "",
    });

    const sd = (e) => {
        const { name, value } = e.target;
        sud(prev => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        if (!userdata.name || !userdata.email || !userdata.password || !userdata.repassword) {
            return toast("Please fill all the details");
        } else if (userdata.name.length < 5) {
            return toast("Name must be greater than 5 characters");
        } else if (userdata.password !== userdata.repassword) {
            return toast("Please verify both passwords");
        }

        try {
            // Step 1: Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, userdata.email, userdata.password);
            const user = userCredential.user;

            // Step 2: Set display name
            await updateProfile(user, { displayName: userdata.name });

            // Step 3: Save user to Firestore using Firebase UID as document ID ✅
            await setDoc(doc(db, "Users", user.uid), {
                name: userdata.name,
                email: userdata.email,
                cartprod: {}
            });

            toast("Account created", { position: "top-right", autoClose: 2000 });
            navigate("/Login");

        } catch (error) {
            toast(error.message, { position: "top-right" });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <div className="card container" style={{ width: "400px" }}>
                <div className="card-title text-center">
                    <h2>Register</h2>
                    <hr />
                </div>
                <div className="card-body">
                    <form onSubmit={submit}>
                        <label>Name :</label><br />
                        <input type="text" name="name" value={userdata.name} onChange={sd} /><br /><br />

                        <label>Email :</label><br />
                        <input type="email" name="email" value={userdata.email} onChange={sd} /><br /><br />

                        <label>Password :</label><br />
                        <input type="password" name="password" value={userdata.password} onChange={sd} /><br /><br />

                        <label>Re-enter Password :</label><br />
                        <input type="password" name="repassword" value={userdata.repassword} onChange={sd} /><br /><br />

                        <div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <p>
                                Already have an account?
                                <Link className="btn btn-secondary ms-2" to="/Login">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}