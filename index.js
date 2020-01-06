const http = require('http')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

morgan.token('body', (req) => {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

let names = [
    {
        name: "Arto Hellas",
        number: "050-123456",
        id: 1

    },
    {
        name: "Ada Lovelace",
        number: "39-5323523",
        id: 2
    },
    {
        name: "Dan Abramod",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-34-6423122",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook!</h1>')
})
app.get('/info', (req, res) => {
    var maara = names.length;
    const date = Date()
    res.send(`<p>Phonebook has info for ${maara} people </p><p>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(names)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const name = names.find(name => name.id === id)

    if (name) {
        response.json(name)
    } else {
        response.status(404).end()
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    names = names.filter(name => name.id !== id)

    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (body.name === "") {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === "") {
        return response.status(400).json({ error: 'number missing' })
    }
    const sameName = names.filter(p => p.name === body.name)
    const sameNumber = names.filter(p => p.number === body.number)
    
    if (sameName.length > 0) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    if (sameNumber.length > 0) {
        return response.status(400).json({ error: 'number must be unique' })
    }
    const randomId = Math.floor(Math.random() * Math.floor(50000));
    const person = {
        id: randomId,
        name: body.name,
        number: body.number
    }

    names = names.concat(person)

    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})