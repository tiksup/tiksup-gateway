import { Router } from 'express'
import { getMovies } from '../controllers/movieController.js'
import { authMiddleware } from '../middlewares/authentication.js'

const router = Router()

router.get('/', authMiddleware, getMovies)

export default router
