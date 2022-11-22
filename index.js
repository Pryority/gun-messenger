const express = require('express');
const Gun = require('gun');
const app = express();
const PORT = 3030;

app.use(Gun.serve);

const main = () => {
    console.log(`G.M. Server listening at https://localhost:${PORT}`);   
}

const server = app.listen(PORT, main);

Gun({ web: server });