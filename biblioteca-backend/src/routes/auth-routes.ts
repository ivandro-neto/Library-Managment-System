import {Router} from 'express'
import { refreshToken, userLogin, userRegister } from '../controllers/auth-controller'

const router = Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/refresh', refreshToken)

export default router;