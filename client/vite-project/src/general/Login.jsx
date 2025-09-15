import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Login() {

    const navigate = useNavigate();
    //const [user, setUser] = useState(null)
    const { user, setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const [formErrors, setFormErros] = useState({});
    const [returnErrors, setReturnErrors] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function validateForm(){
        let errors = {};
        const usernameRegex = /^[A-Za-z0-9_]{5,24}$/;
        const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,128}$/;

        if(!formData.username || !usernameRegex.test(formData.username)){
            errors.username = "Username can only contain letters, numbers, underscores and be 5-24 characters"
        }
        if(!passwordRegex.test(formData.password)){
            errors.password = "Enter a valid password. At least 8 characters and at least 1 special character"
        }

        return errors
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function onSubmit(formSubmit){
        formSubmit.preventDefault();
        setReturnErrors("");
        const err = validateForm();
        setFormErros(err);
        console.log(err)
        if (Object.keys(err).length > 0) return;

        setSubmitting(true);

        try{
            const res = await fetch('/api/login', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            if(!res.ok){
                const errorData = await res.json();
                setReturnErrors(errorData.message || "Registration failed");
                setSubmitting(false);
                return;
            }

            const data = await res.json();
            setUser(data.user);
            navigate("/home")
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
                            Login to an Existing Account
                        </h1>
                        
                        <p className = "form-subtitle">
                            Enter your username and your password to track and view your previous games.
                        </p>
                    </div>
                    {returnErrors && (
                        <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>
                            {returnErrors}
                        </div>
                    )}

                    <div className = "form-wrapper">
                        <form className="register-form" onSubmit = {onSubmit}>
                            <div className="form-field">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value = {formData.username}
                                    onChange = {handleInputChange}
                                    autoComplete="username"
                                    required
                                    minLength={5}
                                    maxLength={24}
                                />
                            </div>
                            {formErrors.username && <small style={{color: 'red'}}>{formErrors.username}</small>}
                            <div className="form-row ">
                                <div className="form-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value = {formData.password}
                                        onChange = {handleInputChange}
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            {formErrors.password && <small style={{color: 'red'}}>{formErrors.password}</small>}
                            <div className="form-submit-container">
                                <button
                                    type="submit"
                                    className="button-primary">
                                        {submitting ? <>Logging In...</>:<> Login</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );


}