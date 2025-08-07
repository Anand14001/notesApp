const express = require('express')
require('dotenv').config()
const Note = require('./models/note')

const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()

}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

console.log('server started')

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]



app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(results => {
    response.json(results)
  })
  
  console.log(`notes fetched:` )
})


app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(
    results => {
      if(results){
      response.json(results)
    }else{
      response.status(404).end()
    }
    }
  ).catch(error => next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
  .then(results => {
    response.status(204).end()
  })
  .catch(error => next(error))
} )

app.put('/api/notes/:id', (request, response, next) => {
  const {content, important} = request.body
  Note.findByIdAndUpdate(request.params.id)
  .then(
    result => {
      if(!result){
        response.status(404).end()
      }

      result.content = content;
      result.important= important;

      return result.save().then(
        updatedNote => {
            response.json(updatedNote)
        }
      ).catch(error => next(error))
    }
  )
  .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(results => {
    response.json(results)
  }).catch(error => next(error))

})

const port = process.env.PORT

app.listen(port)
console.log('server running in port', port)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)

const errorHandler = (error, request,  response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
  return response.status(400).send({error: 'malformatted id'});
  }else if (error.name == 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}


app.use(errorHandler)