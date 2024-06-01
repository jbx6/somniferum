// server.js
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const PORT = process.env.PORT || 6197;
const csvFilePath = 'data.csv';

app.use(express.static('public'));
app.use(express.json()); // Add this line to parse JSON request bodies

// endpoint to add a plant
app.post('/add-plant', (req, res) => {
    const { name, found, amount, type, formDate } = req.body; // Extract data from request body
    const date = new Date(formDate);
    const newData = { name, found, date: date.toLocaleDateString(), time: date.toLocaleTimeString(), amount, type };

    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [{ id: 'name', title: 'name' }, { id: 'found', title: 'found' }, { id: 'date', title: 'date' }, { id: 'time', title: 'time' }, { id: 'amount', title: 'amount'}, { id: 'type', title: 'type' }],
        append: true
    });

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            if (row.name === name) {
                res.status(400).send('Plant already exists');
            }
        })
        .on('end', () => {
            csvWriter.writeRecords([newData])
                .then(() => {
                    res.status(201).send('Plant added successfully');
                });
        });
});

// endpoint to get all plants
app.get('/get-plants', (req, res) => {
    const plants = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            plants.push(row);
        })
        .on('end', () => {
            res.json(plants);
        });
});

// endpoint to delete a plant
app.post('/delete-plant', (req, res) => {
    const { name } = req.body;
    const plants = [];

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            if (row.name !== name) {
                plants.push(row);
            }
        })
        .on('end', () => {
            const csvWriter = createObjectCsvWriter({
                path: csvFilePath,
                header: [{ id: 'name', title: 'name' }, { id: 'found', title: 'found' }, { id: 'date', title: 'date' }, { id: 'time', title: 'time' }, { id: 'amount', title: 'amount'}, { id: 'type', title: 'type' }]
            });

            csvWriter.writeRecords(plants)
                .then(() => {
                    res.send('Plant deleted successfully');
                });
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
