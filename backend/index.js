const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

//To get folder structure data
app.get('/getFolderStructure', (req, res) => {
    try {
        let fileData;
        if (fs.existsSync('./FileStructureData.txt')) {
            let strData = fs.readFileSync('./FileStructureData.txt');
            if (strData) {
                fileData = JSON.parse(strData);

                res.send({ isSuccess: true, data: fileData });
            }
            else {
                console.log('File empty')
                res.send({ isSuccess: false, data: 'File empty' });
            }
        }
        else {
            console.log('No file found')
            res.send({ isSuccess: false, data: 'No such file found' });
        }
    }
    catch (err) {
        console.log(err)
        res.send({ isSuccess: false, msg: 'Error while reading file' })
    }
})

//Add/update folder structure
app.post('/addUpdateFolderStructure', (req, res) => {
    try {
        if (req.body) {
            fs.writeFileSync('./FileStructureData.txt', JSON.stringify(req.body));

            console.log('File update success');
            res.send({ isSuccess: true, data: 'File update success' });
        }
        else {
            console.log('No data received');
            res.send({ isSuccess: false, msg: 'No data to update' })
        }
    }
    catch (err) {
        console.log(err)
        res.send({ isSuccess: false, msg: 'Error while writing file' })
    }
})

app.listen(5000, () => {
    console.log('Server started on 5000')
})