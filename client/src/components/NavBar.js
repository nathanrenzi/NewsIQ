import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <header className={styles.container}>
            <button onClick={() => navigate("/")} className={styles.logo}>NewsIQ</button>
            {loggedIn &&
                <button onClick={() => navigate("/profile")} className={styles.profileButton}></button>
            }
            {!loggedIn &&
                <button onClick={() => { navigate("/auth"); setLoggedIn(true); }} className={styles.loginButton}>Login / Signup</button>
            }
        </header>
    )
}