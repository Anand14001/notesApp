const mongoose = require('mongoose');

if(process.argv.length > 3 ) {
  console.log('give password as argument');
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://anand141901:${password}@cluster0.llbp6ub.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const notSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', notSchema)
const Phone = mongoose.model('Phone', notSchema)
const note = new Note({
  content:'hey, how are you?',
  important:true
})

note.save().then(results => {
  console.log(results)
})
Note.find({}).then(results => {
  results.forEach(note => {
    console.log(note)
  })
})


Phone.find({}).then(results => {
  results.forEach(phone => {
    console.log('phones:',phone)
  })
  mongoose.connection.close()
})
