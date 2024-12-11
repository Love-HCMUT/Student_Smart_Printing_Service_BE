import { body, query, param, validationResult } from 'express-validator'
import { createResponse } from '../config/api-response.js'

export const validationRequest = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(createResponse(false, errors.array()))
    }
    next()
}

export const validatePaymentRule = [
    body('money')
        .isInt({ min: 5000 })
        .withMessage('The amount of money is at least 5000'),
    body('combo')
        .isArray()
        .withMessage('Combo must be an array'),
    body('note')
        .isString()
        .withMessage('Note must be a string'),
    body('id')
        .isString()
        .withMessage('User id must be an string')
]

export const validateCheckStatusRule = [
    param('id')
        .isString()
        .withMessage('User id must be a string')
]