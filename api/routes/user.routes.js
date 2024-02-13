import express from 'express';
const userRoutes = express.Router();


import  {
    createUser,
    login,
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser
} from '../controllers/users.controllers.js' 


// Routes:
userRoutes.get('/', getAllUsers);
userRoutes.get('/:userId', getUserById);
userRoutes.put('/:userId', updateUser);
userRoutes.post('/createAccount', createUser);
userRoutes.post("/login", login)
userRoutes.delete('/:userId', deleteUser);


export default userRoutes;