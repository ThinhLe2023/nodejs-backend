const express = require('express');
const { Worker } = require('worker_threads');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.get('/hello', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello world!"
    })
});

app.post('/', async (req, res) => {
    const { title, content } = req.body;
    try {
        const entity = await prisma.entity.create({
            data: {title, content}
        })
        res.status(201).json({
            success: true,
            data: entity 
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
})