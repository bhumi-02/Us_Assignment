const express = require('express')
const mongoose = require('mongoose');
const multer = require('multer');


const route = require('./route/route.js')
const app = express()

app.use(express.json());
app.use(multer().any())



mongoose.connect("mongodb+srv://functionUpUranium-2:JECVxS0v96bKoG0a@cluster0.j1yrl.mongodb.net/bhumi-DB", { useNewurlParser: true })
    .then(() => console.log("MongoDB is Connected"))
    .catch(error => console.log(error))

    var SolrNode = require('solr-node');
    var client = new SolrNode({
        host: 'localhost',
        port: '8983',
        core: 'test',
        protocol: 'http'
    });
   

app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});