import  express  from "express"

const router = express.Router();

router.get('/', function(req,res) {
    res.send('Hello Login and Register')
})

router.get('/si', function(req,res) {
    res.send('Hello Login')
})

router.get('/su', function(req,res) {
    res.send('Hello Register')
})

export default router;