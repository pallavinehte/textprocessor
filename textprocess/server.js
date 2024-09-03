const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        // Process the text to find the most frequently used word
        const words = data.match(/\b\w+\b/g);
        const wordCounts = {};
        let maxCount = 0;
        let mostFrequentWord = '';

        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
            if (wordCounts[word] > maxCount) {
                maxCount = wordCounts[word];
                mostFrequentWord = word;
            }
        });

        // Prefix the most frequently used word with "xyzz"
        const modifiedText = data.replace(new RegExp(`\\b${mostFrequentWord}\\b`, 'g'), `foo${mostFrequentWord}bar`);

        // Send the modified text back to the client
        res.send(`
            <h1>File Contents:</h1>
            <pre>${modifiedText}</pre>
            <button onclick="window.location.href='/'">Go Back to Upload Page</button>
        `);
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});