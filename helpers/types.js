import db from '../models'

exports.getTypesList = (req, res) => {
  db.Type.find()
    .then((type) => {
      res.json(type)
    })
    .catch((err) => {
      res.send(err)
    })
}

exports.getTypeDetails = (req, res) => {
  db.Type.find({ type: req.params.type })
    .then((type) => {
      res.json(type)
    })
    .catch(err => {
      res.send(err)
    })
}