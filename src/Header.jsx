import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default function Header() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let us = onAuthStateChanged(auth, (user => {
            if (user) {
                setUser(user);
                console.log(user)
            }

        }));

    }, []); // run only once

    const lout = async () => {
        await auth.signOut();
        setUser(null); // clear user state
        navigate("/register");
        localStorage.clear();
    };

    async function deleteAccount(password) {
        try {
            const user = auth.currentUser;
            if (user) {
                // Step 1: Re-authenticate
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);

                // Step 2: Delete from json-server
                const res = await fetch(`http://localhost:3006/Users?firebaseUid=${user.uid}`);
                const users = await res.json();
                if (users.length > 0) {
                    await fetch(`http://localhost:3006/Users/${users[0].id}`, { method: "DELETE" });
                }


                // Step 3: Delete from Firebase Auth
                await user.delete();

                console.log("User account deleted successfully");
            } else {
                console.log("No user is currently signed in");
            }
        } catch (error) {
            console.error("Error deleting account:", error.message);
        }
    }

    return (
        <header className="navbar navbar-expand-lg pt-3">
            <div className="container">
                <NavLink to="/">
                    <h2>Ecommerce</h2>
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav gap-5 ms-auto">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/Products">Products</NavLink></li>
                        <li><NavLink to="/Cart">Cart 🛒</NavLink></li>
                    </ul>

                    <ul className="navbar-nav gap-5 ms-auto mt-sm-4 mt-lg-0">
                        {!user ? (
                            <>
                                <li><NavLink to="/Register">Register</NavLink></li>
                                <li><NavLink to="/Login">Login</NavLink></li>
                            </>
                        ) : (
                            <>
                                <li className="mt-1">hi <b>{user.displayName}</b></li>
                                <li><button className="btn btn-danger" onClick={lout}>Logout</button></li>
                                {/* <li><button className="btn btn-danger" onClick={deleteAccount}>delect acc</button></li> */}
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}
