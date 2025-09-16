import { Router } from 'express';
const router = Router();
import { getRecordByAccountId, updateRecord } from '../queries/records.js';
import { getGameHistoryByAccountId, createGameHistory } from '../queries/history.js';
import { getUserByUsername, getUserByEmail, createUser, findByEmail, findByUsername, getUserDetailsByUsername, getDetailsWithID } from '../queries/users.js';
import jsonwebtoken from 'jsonwebtoken';
const secret = process.env.SECRET;
if(! secret ) {
    throw new Error("SECRET is not defined in environment variables");
}

/* 
    Status Codes:
        200 - OK
        201 - Created
        400 - Bad Request
        401 - Unauthorized
        403 - Forbidden
        404 - Not Found
        409 - Conflict
        500 - Internal Server Error
        503 - Service Unavailable

*/

const usernameRegex = /^[A-Za-z0-9_]{5,24}$/;
const nameRegex = /^[A-Za-z]{2,300}$/;
const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,150}$/; // At least 8 characters and at least 1 special character

router.post('/register', async (req, res, next) => {
    try {
        let { name, username, email, password } = req.body;

        name = typeof name === 'string' ? name.trim() : '';
        username = typeof username === 'string' ? username.trim() : '';
        email = typeof email === 'string' ? email.trim() : '';
        password = typeof password === 'string' ? password : '';

        if (!name || !username || !password) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if( !usernameRegex.test(username)){
            return res.status(400).json({ message: 'Username can only contain letters, numbers, underscores and be 5-24 characters.' });
        }

        if( !nameRegex.test(name)){
            return res.status(400).json({ message: 'Name can only contain letters and be 2-30 characters.' });
        }
        if (!email.includes('@') || email.length < 5 || email.length > 100) {
            return res.status(400).json({ message: 'Enter a valid email.' });
        }
        if( !passwordRegex.test(password)){
            return res.status(400).json({ message: 'Enter a valid password. At least 8 characters and at least 1 special character.' });
        }

        // Check if username or email already exists
        const isExistingUser = await findByUsername({username}) || await findByEmail({email});
        console.log("Is existing user:", isExistingUser);
        if (isExistingUser) {
            return res.status(409).json({ message: 'Username or email already in use.' });

        }

        const createdUser = await createUser({ name, username, email, password });
        return res.status(201).json(createdUser);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt for username:", username);

        if (!username || !password) {
            return res.status(400).send({ message: 'Username and password are required' });
        }
        if( typeof username !== 'string' || typeof password !== 'string'){
            return res.status(400).send({ message: 'Username and password must be strings' });
        }
        if(!usernameRegex.test(username)){
            return res.status(400).send({ message: 'Invalid username format' });
        }

        const user = await findByUsername({username}); // returns full user record or null
        console.log("username given",username)
        console.log("User found:", user); // Moved this after user is defined

        if (!user) {
            console.log("User not found in database");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("Calling getUserByUsername for authentication...");
        const authenticatedUser = await getUserByUsername({ username, password });
        console.log("getUserByUsername result:", authenticatedUser);

        if (authenticatedUser === "Incorrect Credentials") {
            console.log("Password verification failed");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jsonwebtoken.sign(
            {
                accountId: authenticatedUser.account_id,
                username: authenticatedUser.username
            },
            secret,
            { expiresIn: '7d' }
        );

        // Updated cookie settings for cross-origin
        const cookieOptions = {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        };

        console.log("Setting cookie with options:", cookieOptions);
        res.cookie("token", token, cookieOptions);

        console.log("Login successful, sending response");
        return res.status(200).json({ 
            user: {
                accountId: authenticatedUser.account_id, 
                username: authenticatedUser.username, 
                name: authenticatedUser.name, 
                email: authenticatedUser.email 
            } 
        });
    } catch (error) {
        console.error("Login error:", error);
        next(error);
    }
});

function authenticateCookie(req, res, next) {
    console.log('=== authenticateCookie called ===');
    console.log('All cookies:', req.cookies);
    
    const token = req.cookies?.token;
    console.log('Token from cookie:', token ? 'Present' : 'Missing');
    
    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('Verifying token...');
    jsonwebtoken.verify(token, secret, (err, payload) => {
        if (err) {
            console.error('Token verification error:', err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        console.log('Token verified successfully. Payload:', payload);
        req.auth = payload; 
        next();
    });
}

router.get('/me', authenticateCookie, async (req, res, next) => {
    try {
        console.log('=== /me endpoint called ===');
        console.log('req.auth:', req.auth);
        console.log('Username from token:', req.auth?.username);

        if (!req.auth?.username) {
            console.log('No username in auth payload');
            return res.status(400).json({ message: "No username in token" });
        }

        console.log('Calling findByUsername...');
        const user = await findByUsername({
            username: req.auth.username
        });

        console.log('findByUsername result:', user);
        if (!user) {
            console.log('User not found in database');
            return res.status(404).json({ message: "User not found" });
        }

        console.log('Calling getDetailsWithID with account_id:', user.account_id);
        const userDetails = await getDetailsWithID({account_id: user.account_id});
        console.log('getDetailsWithID result:', userDetails);
        
        const response = {
            user: {
                accountId: userDetails.account_id,
                username: userDetails.username,
                name: userDetails.name,
                email: userDetails.email
            }
        };
        
        console.log('Sending response:', response);
        res.json(response);
        
    } catch (e) {
        console.error('Error in /me endpoint:', e);
        console.error('Error stack:', e.stack);
        next(e);
    }
});

// --- LOGOUT: clear cookie ---
router.post('/logout', (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    res.status(204).end();
});

router.get('/records/:accountId', async (req, res, next) => {
    const { accountId } = req.params;
    try {
        const records = await getRecordByAccountId(accountId);
        
        // If no record exists, create a default one or return default values
        if (!records) {
            const defaultRecord = {
                record_id: null,
                account_id: parseInt(accountId),
                num_matches_played: 0,
                wins: 0,
                losses: 0,
                stalemates: 0,
                best_time: null,
                fewest_num_moves_win: null
            };
            return res.json(defaultRecord);
        }
        
        res.json(records);
    } catch (error) {
        next(error);
    }
});

router.put('/records', async (req, res, next) => {
    const recordUpdate = req.body;
    try {
        const updatedRecord = await updateRecord(recordUpdate);
        res.send(updatedRecord);
    } catch (error) {
        next(error);
    }
});

router.get('/history/:accountId', async (req, res, next) => {
    const { accountId } = req.params;
    try {
        const history = await getGameHistoryByAccountId(accountId);
        res.send(history);
    } catch (error) {
        next(error);
    }
});
router.post('/history', async (req, res, next) => {
    const newHistory = req.body;
    try {
        const createdHistory = await createGameHistory(newHistory);
        res.send(createdHistory);
    } catch (error) {
        next(error);
    }
});

export default router;
