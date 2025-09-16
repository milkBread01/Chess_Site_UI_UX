import { useState } from "react"
import { useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmedPassword: ""
    });

    const [formErrors, setFormErros] = useState({});
    const [returnErrors, setReturnErrors] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function validateForm(){
        let errors = {};
        const usernameRegex = /^[A-Za-z0-9_]{5,24}$/;
        const nameRegex = /^[A-Za-z]{2,30}$/;
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,128}$/;

        if(!form.name.trim() || !nameRegex.test(form.name)){
            errors.name = "Please Enter Your Name"
        }
        if(!form.username || !usernameRegex.test(form.username)){
            errors.username = "Username can only contain letters, numbers, underscores and be 5-24 characters"
        }
        if(!form.email.includes("@")){
            errors.email = "Enter a valid email"
        }
        if(!passwordRegex.test(form.password)){
            errors.password = "Enter a valid password. At least 8 characters and at least 1 special character"
        }
        if(form.password !== form.confirmedPassword){
            errors.confirmedPassword = "Passwords do not match"
        }
        return errors

    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function onSubmit(formSubmit){
        formSubmit.preventDefault();
        setReturnErrors("");
        const err = validateForm();
        setFormErros(err);
        console.log(err)
        if(Object.keys(err).length > 0) return;

        setSubmitting(true);

        try{
            const res = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: form.name.trim(),
                    username: form.username,
                    email: form.email,
                    password: form.password
                })
            });

            if(!res.ok){
                const errorData = await res.json();
                setReturnErrors(errorData.message || "Registration failed");
                setSubmitting(false);
                return;
            }
            navigate("/login")

        }catch(er){
            setReturnErrors("Network error occurred")
            setSubmitting(false)
        }
    }


    return (
        <>
            <main className = "form-main">
                <section className = "form-container">
                    <div className = "header1-container">
                        <h1 id = "register-title" className = "header1-type2">
                            Register A New Account
                        </h1>
                        
                        <p className = "form-subtitle">
                            Create your account to save games and track progress.
                        </p>
                    </div>

                    <div className = "form-wrapper">
                        <form className="register-form" onSubmit={onSubmit}>
                            {returnErrors && (
                                <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>
                                    {returnErrors}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        id = "name"
                                        name = "name"
                                        type = "text"
                                        value = {form.name}
                                        onChange = {handleInputChange}
                                        autoComplete = "given-name"
                                        required 
                                    />
                                </div>
                                {formErrors.name && <small style={{color: 'red'}}>{formErrors.name}</small>}
                            </div>

                            <div className="form-field">
                                <label htmlFor="username">Username</label>
                                <input
                                    id = "username"
                                    name = "username"
                                    type = "text"
                                    value = {form.username}
                                    onChange = {handleInputChange}
                                    autoComplete = "username"
                                    required
                                    minLength = {5}
                                    maxLength = {24}
                                />
                                {formErrors.username && <small style={{color: 'red'}}>{formErrors.username}</small>}
                                <small className="hint">5-24 characters, letters, numbers, and underscores only.</small>
                            </div>

                            <div className="form-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    id = "email"
                                    name = "email"
                                    type = "email"
                                    value = {form.email}
                                    onChange = {handleInputChange}
                                    autoComplete = "email"
                                    required
                                />
                                {formErrors.email && <small style={{color: 'red'}}>{formErrors.email}</small>}
                            </div>

                            <div className="form-row ">
                                <div className="form-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id = "password"
                                        name = "password"
                                        type = "password"
                                        value = {form.password}
                                        onChange = {handleInputChange}
                                        autoComplete = "new-password"
                                        required
                                        minLength = {8}
                                    />
                                    {formErrors.password && <small style={{color: 'red'}}>{formErrors.password}</small>}
                                    <small className="hint">Be sure to use at least 8 characters and at least 1 special char (i.e. *, -, +, !, @)</small>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="confirmedPassword">Confirm password</label>
                                    <input
                                        id = "confirmedPassword"
                                        name = "confirmedPassword"
                                        type = "password"
                                        value = {form.confirmedPassword}
                                        onChange = {handleInputChange}
                                        autoComplete = "new-password"
                                        required
                                    />
                                    {formErrors.confirmedPassword && <small style={{color: 'red'}}>{formErrors.confirmedPassword}</small>}
                                </div>
                            </div>

                            <div className="form-submit-container">
                                <button
                                    type = "submit"
                                    className = "button-primary"
                                    
                                >
                                    {submitting ? <>Creating</> : <>Please Fill Out Form to Create Account</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}