const http = require('http')


const express = require('express')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')



require('dotenv').config()
app.use(express.static('build'))

const Person = require('./models/person')

app.use(bodyParser.json())

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

morgan.token('body', (req) => { return JSON.stringify(req.body) })
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
app.get('/api', (req, res) => {
    res.send('<h1>Jotain</h1>')
})
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const body = request.body
    if (body.name === "") {
        return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === "") {
        return response.status(400).json({ error: 'number missing' })
    }

    const randomId = Math.floor(Math.random() * Math.floor(100000))
    const person = new Person({
        id: randomId,
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
    const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
    }
    app.use(unknownEndpoint)

    const errorHandler = (error, request, response, next) => {
        console.error(error.message)
        if (error.name === 'CastError' && error.kind == 'ObjectId') {
            return response.status(400).send({ error: 'malformatted id' })
        }
        next(error)
    }
    app.use(errorHandler)
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
