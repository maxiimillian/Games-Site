import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export async function getUser() {
    console.log("getting user...")
    await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({token: localStorage.getItem("token")}),
    })
    .then((data) => {
        console.log("API REQUEST FRONTEND", publicRuntimeConfig.NEXT_PUBLIC_API_URL);
        console.log(publicRuntimeConfig);
        return data.json();
    })
    .then((resp) => {
        console.log("CURRENT TOKEN => ", localStorage.getItem("token"))
        if (resp.success) {
            console.log("e", resp)
            localStorage.setItem("token", resp.token);
        } else {
            console.log(resp);
            throw "Could not authenticate";
        }
    })

    return await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/auth/profile`, {
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
            return data;
        }
    })

}

export async function register(username, password, email) {
    return await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/auth/register`, {
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
}

export async function login(user, password) {
    return await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/auth/login`, {
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
}

export async function logout(user, password) {
    const response = await fetch(`${publicRuntimeConfig.NEXT_PUBLIC_API_URL}/auth/login`, {
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
}