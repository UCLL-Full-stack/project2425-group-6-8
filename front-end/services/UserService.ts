import { User } from "@types";

const loginUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
};
// commit to make live easier

const registerUser = (user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });
};

const getAllUsers = async () => {
    const loggedInUserData = (() => {
        if (typeof localStorage === "undefined") {
            console.warn("localStorage is not defined.");
            return null;
        }
        const item = localStorage.getItem("loggedInUser");
        return item ? JSON.parse(item) : null;
      })();

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUserData.token}`
        },
    });
    const users = await response.json();
    return users;
};

const UserService = {
    loginUser,
    registerUser,
    getAllUsers
};



export default UserService;
