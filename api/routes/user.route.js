import express from 'express';
import { deleteUser, getUser, getUsers, signOutUser, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.get('/test', test)
//check authenticate user 'verifyToken'
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signOutUser);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser);

export default router;
