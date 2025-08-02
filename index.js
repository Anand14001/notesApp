const express = require('express')

const app = express()

app.use(express.json())
app.use(express.static('dist'))

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

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()

}
console.log('middleware running')
app.use(requestLogger)

console.log('middleware running')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}




app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
  console.log(`notes fetched:` )
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find((note => note.id == id))
  if(note){
  response.json(note)
  } else{
    response.status(404).send("<h1>Note not found!</h1>")
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.filter((note => note.id !== id))
  response.status(204).end()
} )

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})
const port = process.env.PORT || 3001

app.listen(port)
console.log('server running in port', port)

app.use(unknownEndpoint)