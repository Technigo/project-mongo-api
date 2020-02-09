await House.deleteMany()


await new House({ name: gryffindor, mascot: "Lion", head_teacher: "Minverva McGonogall", ghost: "Nearly Headless Nick", founder: "Godric Gryffindor" }).save()
await new House({ name: "Slytherin", mascot: "Snake", head_teacher: "Severus Snape", ghost: "The Bloody Baron", founder: "Salazar Slytherin" }).save()
await new House({ name: "Ravenclaw", mascot: "Eagle", head_teacher: "Filius Flitwick", ghost: "The Grey Lady", founder: "Rowena Ravenclaw" }).save()
await new House({ name: "Hufflepuff", mascot: "Badger", head_teacher: "Pomona Sprout", ghost: "the Far Friar", founder: "Helga Hufflepuff" }).save()


//HOUSE MODEL
const House = mongoose.model('House', {
  name: String,
  mascot: String,
  head_teacher: String,
  ghost: String,
  founder: String
})
