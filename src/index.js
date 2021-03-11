// --------------- LIBRARIES ---------------
import '@babel/polyfill';
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { v4 as uuid4 } from 'uuid';

// --------------- ASSETS ---------------
import constants, { TABLES } from './Constants';
import middlewares from './config/middlewares';
import DAO from './config/db/DAO';
import socket, { IO_EVENTS } from './socket';

var users = {};
const app = express(); // create an instance of express

// --------------- APPLY MIDDLEWARES ---------------
middlewares(app);

// Root path for server ----------
app.use('/', async (req, res) => {
    const users = await DAO.findAll(TABLES.TABLE_USER);
    res.send(`<h1>Meetx</h1>Welcome :) - Number of users: ${users.length}`);
});
const _httpServer = http.createServer(app);

// --------------- SOCKET ---------------
var io = socketio(_httpServer);
io.on('connection', (client) => {
    console.log('User connected: ', client.id, users);

    // When user join socket
    client.on(IO_EVENTS.JOIN_SOCKET, socket(io, client).JoinSocket)

    // Fetch all chats
    client.on(IO_EVENTS.FETCH_CHATS, socket(io, client).FetchChats)

    // Fetch all messages
    client.on(IO_EVENTS.FETCH_MESSAGES, socket(io, client).FetchMessages);

    // Send new message
    client.on(IO_EVENTS.SEND_MESSAGE, socket(io, client).SendMessage)
    
    // When user closes app
    client.on(IO_EVENTS.DISCONNECT_SOCKET, (reason) => {
      console.log('User disconnected:', reason);
    });
});

// --------------- SERVER ---------------
_httpServer.listen(constants.PORT, (err) => {
    if (err) {
        console.error('Server error: ', err);
    }

    console.log(`🚀 Server is ready at http://${constants.BASE_URL}`);
});
