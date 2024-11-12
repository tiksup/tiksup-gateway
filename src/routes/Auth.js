import { Router } from 'express'
import { registerUser, loginUser, deleteUser } from '../controllers/AuthController.js'
import { authMiddleware } from '../middlewares/authentication.js'

const router = Router()

router.post('/login', authMiddleware, loginUser)
router.post('/register', authMiddleware, registerUser)
router.delete('/delete/:userId', authMiddleware, deleteUser)

export default router
