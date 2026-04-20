const express = require('express');
const path = require('path');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const app = express();
const PORT = 3000;

const liveReloadServer = livereload.createServer();
liveReloadServer.watch([
    path.join(__dirname, 'public'),
    path.join(__dirname, 'src')
]);

app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));