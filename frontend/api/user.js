import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export async function getUser() {
    console.log("getting user...")
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token: localStorage.getItem("token")}),
    })
    .then((data) => {
        return data.json();
    })
    .then((resp) => {
        if (resp.success) {
            localStorage.setItem("token", resp.token);
        } else {
            throw "Could not authenticate";
        }
    })
    .catch((err) => {
        throw "Could not connect to the server";
    })

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token: localStorage.getItem("token")}),
    })
    .then(data => {
        return data.json();
    })
    .then(data => {
        if (!data.success) {
            throw data.message;
        } else {
            data["token"] = localStorage.getItem("token");
            return data;
        }
    })
    .catch((err) => {
        throw "Could not connect to the server";
    })

}

export async function register(username, password, email) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"username": username, "password": password, "email": email}),
    })
    .then(data => {
        console.log("RD => ", data);
        return data.json()
    })
    .then(data => {
        if (!data.success) {
            throw data.message;
        } else {
            console.log(data);
            return data;
        }
    })
    .catch((err) => {
        throw "Could not connect to the server";
    })
}

export async function login(user, password) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"username": user, "password": password}),
    })
    .then(data => {
        console.log("DATA => ", data);
        return data.json();
    })
    .then(data => {
        if (!data.success) {
            console.log("FAILED", data.message);
            throw data.message;
        } else {
            console.log("d => ", data);
            return data;
        }
    })
    .catch((err) => {
        throw "Could not connect to the server";
    })
}

export async function logout(user, password) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"username": user, "password": password}),
    })
    .then(data => {
        return data.json();
    })
    .then(data => {
        if (!data.success) {
            throw data.message;
        } else {
            return data;
        }
    })
    .catch((err) => {
        throw "Could not connect to the server";
    })
}