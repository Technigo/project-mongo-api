import  express from "express"
import { BookModel } from "../models/book";


const router = express.Router()


router.get("/get" , async(req , res) => {
    await BookModel.find()
    .then((result) => res.json(result))
    .catch((error) => res.json(error))
});

router.post("/add" , async(req , res) => {
    const book = req.body;

    await BookModel.create({title: book.title, authors: book.authors, average_rating: book.average_rating  })
    .then((result) => res.json(result))
    .catch((error) => res.json(error))

})
router.put("/update/:id" , async(req , res)=>{
    const { id } = req.params;
    await BookModel.findByIdAndUpdate({_id: id}, {language_code: "fa"})
    .then((result) => res.json(result))
    .catch((error) => res.json(error))


})
router.delete("/delete/:id" , async(req , res)=>{
    const { id } = req.params;
    await BookModel.findByIdAndUpdate(id)
    .then((result) =>{
        if(result){
            res.json({
                message: "book deleted successfully",
                deletedBook: result
            })
            
        }else{
            res.status(404).json({message: "book not found"})
        }

    })
    .catch((err) => res.status(500).json(err))
    
})
router.delete("/deleteAll" , async(req , res)=>{

    await BookModel.deleteMany({})
    .then((result) =>{
        if(result){
            res.json({
                message: "all books deleted",
                deletedCount: result.deletedCount
            })
            
        }else{
            res.status(404).json({message: "book not found"})
        }

    })
    .catch((err) => res.status(500).json(err))
    
    
})
export default router