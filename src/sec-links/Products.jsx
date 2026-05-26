import React, { useState, useEffect } from "react";

export default function Products({ data }) {
    const [ival, sival] = useState({});
    const [cat, scat] = useState("all");
    const userId = localStorage.getItem("userId");

    // Load cart from API on mount
    useEffect(() => {
        const loadCart = async () => {
            const res = await fetch(`http://localhost:3006/Users/${userId}`);
            const user = await res.json();
            sival(user.cartprod || {});
        };
        if (userId) loadCart();
    }, [userId]);

    // Increment item
    const incid = async (id) => {
        const newVal = (ival[id] || 0) + 1;
        const newCart = { ...ival, [id]: newVal };
        sival(newCart);
        localStorage.setItem("userCart", JSON.stringify(newCart));

        await fetch(`http://localhost:3006/Users/${userId}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ cartprod: newCart }),
        });
    };

    // Decrement item
    const decid = async (id) => {
        const newVal = Math.max((ival[id] || 0) - 1, 0);
        const newCart = { ...ival, [id]: newVal };
        sival(newCart);
        localStorage.setItem("userCart", JSON.stringify(newCart));

        await fetch(`http://localhost:3006/Users/${userId}`, {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ cartprod: newCart }),
        });
    };

    return (
        <div className="container">
            {/* Category filter buttons */}
            <ul className="d-flex flex-wrap gap-3 justify-content-evenly mt-5" type="none">
                <li className="btn btn-secondary" onClick={() => scat("all")}>All</li>
                <li className="btn btn-secondary" onClick={() => scat("men's clothing")}>Men's Clothing</li>
                <li className="btn btn-secondary" onClick={() => scat("women's clothing")}>Women's Clothing</li>
                <li className="btn btn-secondary" onClick={() => scat("jewelery")}>Jewelery</li>
                <li className="btn btn-secondary" onClick={() => scat("electronics")}>Electronics</li>
            </ul>
            <hr />

            {/* Product cards */}
            <div className="d-flex flex-wrap gap-4 mt-5">
                {(cat === "all" ? data : data.filter(item => item.category === cat)).map((item) => (
                    <div className="card mb-4" key={item.id} style={{ width: "300px" }}>
                        <div className="card-title text-center mt-3">
                            <img src={item.image} width="250" height="300" alt={item.title} />
                        </div>
                        <div className="card-body">
                            <ul type="none">
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
        </div>
    );
}
