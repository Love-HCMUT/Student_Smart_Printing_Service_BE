import { createResponse } from '../config/api-response.js'
import systemconfig from '../models/systemconfig-model.js'


const loadFileData = (req, res) => {
    const filename = req.params.filename
    if (!filename) return res.status(400).json(createResponse(false, "filename is empty"))
    try {
        const response = systemconfig.readData(filename)
        return res.status(200).json(createResponse(true, "Load filetype successfully", response))
    }
    catch (error) {
        return res.status(400).json(createResponse(false, "fail to load filetype"))
    }
}

const updateFileData = (req, res) => {
    const { filename, content } = req.body
    if (!filename) return res.status(400).json(createResponse(false, "filename is empty"))

    try {
        const check = systemconfig.writeData(filename, content)
        if (check) return res.status(200).json(createResponse(true, "update data successfully"))
        else return res.status(400).json(createResponse(false, "fail to update data"))
    }
    catch (error) {
        return res.status(400).json(createResponse(false, "fail to update data"))
    }
}



export default {
    loadFileData,
    updateFileData
}