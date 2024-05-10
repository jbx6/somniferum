#!/usr/bin/env node
const { program } = require('commander');
const { version, description } = require('./package.json');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvFilePath = 'data.csv';

program
    .version(version)
    .description(description)

// Add command to for plant entry
program
    .command('add-plant <name> <found_at> <type>')
    .description('Add a new plant to the database')
    .action((name, found_at, type) => {
        const date = new Date();
        const newData = { name, found_at, date: date.toLocaleDateString(), time: date.toLocaleTimeString(), type };
        
        const csvWriter = createCsvWriter({
            path: csvFilePath,
            header: [{ id: 'name', title: 'Name' }, { id: 'found_at', title: 'Found At' }, { id: 'date', title: 'Date' }, { id: 'time', title: 'Time' }, { id: 'type', title: 'Type' }],
            append: true
        });

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row.name === name) {
                    console.log('Plant already exists');
                    process.exit(1);
                }
            })
            .on('end', () => {
                csvWriter.writeRecords([newData])
                    .then(() => {
                        console.log('Plant added successfully');
                    });
            });
    })

program.parse(process.argv);