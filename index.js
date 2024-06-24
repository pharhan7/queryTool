const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { parseAndTranslateQuery } = require('./parser.js');
const Sample = require('./model.js');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
// MongoDB connection
mongoose.connect('mongodb://root:root1234@143.110.245.179:27017/stock_veer?authSource=admin', { useNewUrlParser: true, useUnifiedTopology: true });

// Route to handle query
app.post('/query', async (req, res) => {
    const { query } = req.body;

    try {
        const mongoQuery = parseAndTranslateQuery(query);
        const results = await Sample.find(mongoQuery);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/love/test", async () => {
    const url = new URL(`/api/v3/stock/list`, fmpApi.defaults.baseURL);
    url.searchParams.set('exchangeShortName', 'NSE');
    const response = await fmpApi({ url });
    const NSC_Stock = []
    const abc = response.data.map(async (x) => {
        if (x.exchangeShortName == "NSE") {
            const ccc = new DynamicModel(x)
            await ccc.save();
            NSC_Stock.push(x)
        }
    })
    res.send(NSC_Stock)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
