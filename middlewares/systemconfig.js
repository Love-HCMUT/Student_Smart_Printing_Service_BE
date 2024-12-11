import { body, query, param, validationResult } from 'express-validator'
import { createResponse } from '../config/api-response.js'


export const validationRequest = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(createResponse(false, errors.array()))
    }
    next()
}

export const validateConfigUpdateRule = [
    body('filename')
        .isString()
        .withMessage("filename must be a string"),
    body('content')
        .isArray()
        .withMessage("Content must be an array")
]

export const validateLoadConfigRule = [
    param('filename')
        .isIn(['filetype', 'paper_per_month'])
        .withMessage('Filename mus be "filetype" or "paper_per_month" ')
]