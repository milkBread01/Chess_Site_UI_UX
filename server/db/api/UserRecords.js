import { Router } from 'express';
const router = Router();
import { getRecordByAccountId, updateRecord } from '../queries/records.js';
import { getGameHistoryByAccountId, createGameHistory } from '../queries/history.js';
import { getUserByUsername, getUserByEmail, createUser, findByEmail, findByUsername } from '../queries/users.js';
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
        if (!email.includes('@') && email.length < 5 && email.length > 100) {
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

        console.log("User found:", user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const authenticatedUser = await getUserByUsername({ username, password });
        if (authenticatedUser === "Incorrect Credentials") {
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
        return res.status(200).json({ 
            token,
            user: {
                accountId: authenticatedUser.account_id, 
                username: authenticatedUser.username, 
                name: authenticatedUser.name, 
                email: authenticatedUser.email 
            } 
        });
    } catch (error) {
        next(error);
    }
});

router.get('/records/:accountId', async (req, res, next) => {
    const { accountId } = req.params;
    try {
        const records = await getRecordByAccountId(accountId);
        res.send(records);
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
