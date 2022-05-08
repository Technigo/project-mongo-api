import express from "express";
import NetflixItem from "../models/NetflixItem"

const router = express.Router()

router.get('/allshows', async (req, res) => {
    const allNetflixItems = await NetflixItem.find()
    res.json(allNetflixItems)
})

router.get('/titles/:title', async (req, res) => {
    try {
        const titleInput = req.params.title
        const findByTitle =  await NetflixItem.findOne({ 
            title: new RegExp(titleInput, 'i')
        })
        res.status(200).json({
            data: findByTitle,
            success: true
        })
    } catch (err) {
        res.status(400).json({
            data: "Not found",
            success: false
        })
    }
})

router.get('/country/:country', async (req, res) => {
    try {
        const countryInput = req.params.country
        const findByCountry =  await NetflixItem.find({ 
            country: new RegExp(countryInput, 'i')
        })
        res.status(200).json({
            data: findByCountry,
            success: true
        })
    } catch (err) {
        res.status(200).json({
            data: "Not found",
            success: false
        })
    }
})

//trying to convert string to number if time allows

module.exports = router