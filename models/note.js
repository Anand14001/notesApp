const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
.then(result =>{
    console.log('Database connected')
})
.catch(error => {
    console.log('error connecting database', error.message)
})

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform:(document, returnObject) => {
        returnObject.id= returnObject._id.toString();

        delete returnObject._id;
        delete returnObject.__v
    }
})


module.exports = mongoose.model('Note', noteSchema)