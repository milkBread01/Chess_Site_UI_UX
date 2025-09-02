export default function Login() {

    return (
        <>
            <main className = "form-main">
                <section className = "form-container">
                    <div className = "header1-container">
                        <h1 id = "register-title" className = "header1-type2">
                            Login to an Existing Account
                        </h1>
                        
                        <p className = "form-subtitle">
                            Enter your username/email and your pawssword to track and view your previous games .
                        </p>
                    </div>

                    <div className = "form-wrapper">
                        <form className="register-form">
                            <div className="form-field">
                                <label htmlFor="username">Username or Email</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    minLength={5}
                                    maxLength={24}
                                />
                                
                            </div>

                            <div className="form-row ">
                                <div className="form-field">
                                    <label htmlFor="password">Password</label>
                                    <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="form-submit-container">
                                <button type="submit" className="button-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}