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
        id: 4
    },
    {
        name: "Dan Abramod",
        numberid: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        numberid: "39-34-6423122",
        id: 5
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(names)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})