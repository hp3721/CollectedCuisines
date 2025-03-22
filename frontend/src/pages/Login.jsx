// package imports
import { useState } from "react";
import { useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
// style imports
import styles from "../styles/Login.module.css";
// API imports
import { usePocket } from "../PbContext"; 

const Login = () => {
    // hooks
    const navigate = useNavigate();
    const { login } = usePocket();

    // local state
  

    // functions

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        // basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        // call login API
        const res = await login(email, password);

        setLoading(false);

        if (res) {
            // error occured
            setError('Incorrect email or password. Please try again.');
            return;
        }
        else {
            // logged in
            navigate('/app');
        }
    }


    return (
            <div className={`${styles.page} page h-screen grid grid-cols-2`}>
                <div className={styles.content}>
                    <div className={`card`}>
                        <h1 style={{width: "100%"}}>Collected Cuisine</h1>
                        <h1 style={{width: "100%"}}>Login</h1>
                        <button className={`${styles.btn_google} btn_large`}>
                        <FcGoogle style={{ marginRight: "8px"}} /> 
                        Continue with Google
                        </button>
                        <button className={`${styles.btn_discord} btn_large`}>
                        <FaDiscord style={{ marginRight: "8px"}} /> 
                        Continue with Discord
                        </button>        
                    </div>
                </div>
            </div>     
    );
}

export default Login;