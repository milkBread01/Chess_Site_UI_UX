export default function Register() {

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
                        <form className="register-form">
                            <div className="form-row">
                                <div className="form-field">
                                    <label htmlFor="name">Name</label>
                                    <input id="name" name="name" type="text" autoComplete="given-name" required />
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    minLength={3}
                                    maxLength={24}
                                />
                                <small className="hint">5-24 characters, letters, numbers, and underscores only.</small>
                            </div>

                            <div className="form-field">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" autoComplete="email" required />
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
                                    <small className="hint">At least 8 characters.</small>
                                </div>

                                <div className="form-field">
                                    <label htmlFor="confirmPassword">Confirm password</label>
                                    <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    />
                                </div>
                            </div>

                            <div className="form-submit-container">
                                <button type="submit" className="button-primary">Create Account</button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}