const http = require('http')

const express = require('express')
const app = express()

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
    res.send('<h1>Hello World!</h1>')
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})