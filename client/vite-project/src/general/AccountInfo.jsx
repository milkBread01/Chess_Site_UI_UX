export default function AccountInfo() {
    return (
        <main className="account-main">

            <section className="account-info">
                <div className="info-header-container section-header" role="heading" aria-level={2}>
                    <span>Account Info</span>
                </div>

                <div className="info-container">
                    <div className="info-display">
                        <div className="info-row">
                            <h3>Name</h3>
                            <p><strong>John Doe</strong></p>
                        </div>

                        <div className="info-row">
                            <h3>Username</h3>
                            <p><em>chessMaster42</em></p>
                        </div>

                        <div className="info-row">
                            <h3>Email</h3>
                            <p>john.doe@example.com</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="scores-container">
                <div className="scores-header-container section-header alt" role="heading" aria-level={2}>
                    <span>Scores</span>
                </div>

                <div className="scores-table-container">
                    <div className="table-wrap">
                        <table className="scores-table">
                            <thead>
                                <tr>
                                    <th>Total Games Played</th>
                                    <th>Wins</th>
                                    <th>Losses</th>
                                    <th>Stalemates</th>
                                    <th>W/L Ratio</th>
                                    <th>Best Time</th>
                                    <th>Win in Fewest Number of Moves</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>23</td>
                                    <td>15</td>
                                    <td>5</td>
                                    <td>3</td>
                                    <td>0.65</td>
                                    <td>5:16</td>
                                    <td>18</td>
                                </tr>
                                <tr>
                                    <td>23</td>
                                    <td>15</td>
                                    <td>5</td>
                                    <td>3</td>
                                    <td>0.65</td>
                                    <td>5:16</td>
                                    <td>18</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
