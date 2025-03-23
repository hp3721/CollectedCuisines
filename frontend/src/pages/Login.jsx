import styles from "../styles/Login.module.css";
import logo from "../styles/images/logo.png";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

import { usePocket } from "../PbContext"; 

const Login = () => {
    const { discordAuth, googleAuth } = usePocket();

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <div className={styles.card}>
                    <h1 style={{ width: "100%" }} className={styles.h}>Collected Cuisines</h1>
                    <button onClick={googleAuth} className={`${styles.button} ${styles.btn_google} ${styles.btn_large}`}>
                        <FcGoogle style={{ marginRight: "8px" }} />
                        Continue with Google
                    </button>
                    <button onClick={discordAuth} className={`${styles.button} ${styles.btn_discord} ${styles.btn_large}`}>
                        <FaDiscord style={{ marginRight: "8px" }} />
                        Continue with Discord
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <img src={logo} alt="Logo" />
            </div>
        </div>
    );
}

export default Login;