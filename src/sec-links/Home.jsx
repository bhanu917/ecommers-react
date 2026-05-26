import React, { useState, useEffect } from "react";

export default function Home({ data }) {
    const [ival, sival] = useState({});
    const userId = localStorage.getItem("userId");

    // load cart from API on mount
    useEffect(() => {
        const loadCart = async () => {
            const res = await fetch(`http://localhost:3006/Users/${userId}`)
            const user = await res.json()
            sival(user.cartprod || {})  // load saved cart into state
        }
        if (userId) loadCart()
    }, [userId])

    const incid = async (id) => {
        // update local state
        const newVal = (ival[id] || 0) + 1
        const newCart = { ...ival, [id]: newVal };
        localStorage.setItem("userCart", JSON.stringify(newCart));
        if (newVal === 0) {
            // remove the product entirely if it hits 0
            delete newCart[id];
        } else {
            // otherwise update with the new quantity
            newCart[id] = newVal;
        }
        sival(newCart)

        // update API
        await fetch(`http://localhost:3006/Users/${userId}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ cartprod: newCart })
        })
    }

    const decid = async (id) => {
        // don't go below 0
        const newVal = Math.max((ival[id] || 0) - 1, 0)
        const newCart = { ...ival, [id]: newVal }
        sival(newCart)
        localStorage.setItem("userCart", JSON.stringify(newCart));

        // update API
        await fetch(`http://localhost:3006/Users/${userId}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ cartprod: newCart })
        })
    }

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