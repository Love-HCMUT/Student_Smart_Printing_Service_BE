import { Router } from "express"
import systemconfigController from "../controllers/systemconfig-controller.js"
import { validateConfigUpdateRule, validationRequest, validateLoadConfigRule } from "../middlewares/systemconfig.js"

const router = Router()

router.get('/load-file/:filename', validateLoadConfigRule, validationRequest, systemconfigController.loadFileData)
router.put('/update', validateConfigUpdateRule, validationRequest, systemconfigController.updateFileData)

export default router

