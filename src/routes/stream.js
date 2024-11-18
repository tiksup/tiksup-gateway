import { Router } from 'express'
import { postUserMovieData } from '../controllers/streamController.js'
import { authMiddleware } from '../middlewares/authentication.js'

const router = Router()

router.post('/sendmoviedata', authMiddleware, postUserMovieData)

export default router
