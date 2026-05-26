import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Home({ data }) {
    const [ival, sival] = useState({});
    const [userId, setUserId] = useState(null);

    // Get logged-in user
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) setUserId(user.uid);
            else setUserId(null);
        });
        return () => unsub();
    }, []);

    // Load cart from Firestore when userId is ready
    useEffect(() => {
        const loadCart = async () => {
            try {
                const ref = doc(db, "Users", userId);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    sival(snap.data().cartprod || {});
                }
            } catch (err) {
                console.error("Failed to load cart:", err);
            }
        };
        if (userId) loadCart();
    }, [userId]);

    // Save cart to Firestore
    const saveCart = async (newCart) => {
        try {
            const ref = doc(db, "Users", userId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                await updateDoc(ref, { cartprod: newCart }); // update existing user doc
            } else {
                await setDoc(ref, { cartprod: newCart }); // create if not exists
            }
        } catch (err) {
            console.error("Failed to save cart:", err);
        }
    };

    const incid = async (id) => {
        const newCart = { ...ival, [id]: (ival[id] || 0) + 1 };
        sival(newCart);
        if (userId) await saveCart(newCart);
    };

    const decid = async (id) => {
        const currentVal = ival[id] || 0;
        let newCart;
        if (currentVal <= 1) {
            const { [id]: _, ...rest } = ival; // remove item
            newCart = rest;
        } else {
            newCart = { ...ival, [id]: currentVal - 1 };
        }
        sival(newCart);
        if (userId) await saveCart(newCart);
    };

    return (
        <div className="mt-5 container d-flex flex-wrap gap-4 justify-content-between">
            {data.map((item) => (
                <div className="card mb-4" key={item.id} style={{ width: "300px" }}>
                    <div className="card-title text-center mt-3">
                        <img src={item.image} width="250" height="300" alt={item.title} />
                    </div>
                    <div className="card-body">
                        <ul style={{ listStyle: "none" }}>
                            <li><b>Name:</b> {item.title.substring(0, 20)}</li>
                            <li><b>Price:</b> ${item.price}</li>
                            <li><b>Category:</b> {item.category}</li>
                            <li><b>Description:</b> {item.description.substring(0, 40)}</li>
                        </ul>
                        <div className="d-flex justify-content-center align-items-center">
                            <button className="btn btn-primary me-4" onClick={() => decid(item.id)}>-</button>
                            <p className="m-0">{ival[item.id] || 0}</p>
                            <button className="btn btn-primary ms-4" onClick={() => incid(item.id)}>+</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}