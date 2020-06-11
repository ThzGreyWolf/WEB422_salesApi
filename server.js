const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");

require('dotenv').config({
    path: "./config/keys.env"
});

const myData = dataService(process.env.MDB_CONN_STR);

const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)
app.post("/api/sales", (req, res) => {
    myData.addNewSale(req.body).then((msg) => {
        req.json({message: msg});
    }).catch((err) => {
        res.json({message: `Error: ${err}`});
    });
});

// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales/:page&:perPage", (req, res) => {
    myData.getAllSales(req.params.page, req.params.perPage).then((msg) => {
        req.json({message: msg});
    }).catch((err) => {
        res.json({message: `Error: ${err}`});
    });
});

// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get("/api/sales/:id", (req, res) => {
    myData.getSaleById(req.params.id).then((msg) => {
        req.json({message: msg});
    }).catch((err) => {
        res.json({message: `Error: ${err}`});
    });
});

// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put("/api/sales/:id", (req, res) => {
    myData.updateSaleById(req.body, req.params.id).then((msg) => {
        res.json({message: msg});
    }).catch((err) => {
        res.json({message: `Error: ${err}`});
    });
});

// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req, res) => {
    myData.deleteSaleById(req.params.id).then((msg) => {
        res.json({message: msg});
    }).catch((err) => {
        res.json({message: `Error: ${err}`});
    });
});

// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

