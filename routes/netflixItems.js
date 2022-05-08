import express from "express";
import NetflixItem from "../models/NetflixItem"

const router = express.Router()

router.get('/all', async (req, res) => {
    const allNetflixItems = await NetflixItem.find()
    res.json(allNetflixItems)
})

router.get('/titles/:title', async (req, res) => {
    try {
        const findByTitle =  await NetflixItem.findOne({ title: req.params.title})
        res.status(200).json({
            data: findByTitle,
            success: true
        })
    } catch (err) {
        res.status(200).json({
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

//trying to convert string to number.

// router.get('/year/:year', async (req, res) => {
//     try {
//         console.log(yearInput)
//         const findByYear =  await NetflixItem.find({ 
//             country: +req.params.release_year
//         })
//         res.status(200).json({
//             data: findByYear,
//             success: true
//         })
//     } catch (err) {
//         res.status(200).json({
//             data: "Not found",
//             success: false
//         })
//     }
// })


module.exports = router