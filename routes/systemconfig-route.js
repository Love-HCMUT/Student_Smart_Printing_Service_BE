import { Router } from "express"
import systemconfigController from "../controllers/systemconfig-controller.js"

const router = Router()

router.get('/load-file/:filename', systemconfigController.loadFileData)
router.put('/update', systemconfigController.updateFileData)

export default router

