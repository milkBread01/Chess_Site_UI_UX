import { UserContext } from "./UserContext";
import { useContext, useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";

export default function AccountInfo() {

    const [records, setRecords] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchRecords() {
            console.log('++++++++++Getting Records++++++++++++')
            console.log('User:', user)
            if(!user?.accountId) {
                setLoading(false);
                return;
            }
            console.log('User found, accountId:', user.accountId)

            try{
                const url = `${API_BASE}api/records/${user.accountId}`;
                console.log(`Fetching records at ${url}`)
                const response = await fetch(url, {
                    credentials: 'include' // Include cookies
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Records data received:', data);
                setRecords(data);
                setLoading(false);

            } catch(err) {
                console.error('ERROR FETCHING RECORDS: ', err);
                setError(err.message);
                setLoading(false);
            }
        }

        fetchRecords();
    }, [user?.accountId])

    const wlRatio = records?.losses > 0 
        ? (records.wins / records.losses).toFixed(2) 
        : records?.wins > 0 ? records.wins.toFixed(2) : '0.00';

    function formatTime(seconds) {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading records: {error}</div>;
    if (!records) return <div>No records found</div>;

    return (
        <main className="account-main">

            <section className="account-info">
                <div className="info-header-container section-header">
                    <span>Account Info</span>
                </div>

                <div className="info-container">
                    <div className="info-display">
                        <div className="info-row">
                            <h3>Name</h3>
                            <p><strong>{user?.name || 'John Doe'}</strong></p>
                        </div>

                        <div className="info-row">
                            <h3>Username</h3>
                            <p><em>{user?.username || 'chessMaster42'}</em></p>
                        </div>

                        <div className="info-row">
                            <h3>Email</h3>
                            <p>{user?.email || 'john.doe@example.com'}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="scores-container">
                <div className="scores-header-container section-header alt">
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
                                    <td>{records.num_matches_played}</td>
                                    <td>{records.wins}</td>
                                    <td>{records.losses}</td>
                                    <td>{records.stalemates}</td>
                                    <td>{wlRatio}</td>
                                    <td>{formatTime(records.best_time)}</td>
                                    <td>{records.fewest_num_moves_win || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}