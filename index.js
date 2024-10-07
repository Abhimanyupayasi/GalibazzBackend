import { configDotenv } from 'dotenv';
import { connectDB } from './conf/db.js';
configDotenv();

// connectDB();
// import express from 'express';
// import mongoose  from 'mongoose';
// import dotenv from 'dotenv';
// import connectDB from './conf/db.js';
// import app from './app.js';
// import { auth } from 'express-oauth2-jwt-bearer';
//  console.log("jwtksuri file main ", process.env.AUTH0_JWKS_URI);
//  console.log("jwtksuri file main", process.env.AUTH0_AUDIENCE);
  

connectDB();
import app from './app.js';



// const express = require('express');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { auth } from 'express-oauth2-jwt-bearer';

import { Server as SocketIOServer } from 'socket.io'; // Import Socket.IO
import http from 'http'; // Import http module

console.log( process.env.PORT);



const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



// const server = http.createServer(app);

// // Attach Socket.IO to the same server
// const io = new SocketIOServer(server, {
//   cors: {
//     origin: '*', // Adjust as necessary for your frontend origin
//   },
// });

// // Handle WebSocket connections
// const users = {}; // Keep track of usernames and their corresponding socket IDs

// // Handle WebSocket connections
// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   // Ask for the user's name when they connect
//   socket.on('join', (username) => {
//     users[socket.id] = username; // Save the username with the socket ID
//     console.log(`${username} has joined the chat`);

//     // Notify all clients that a user has joined
//     socket.broadcast.emit('message', `${username} has joined the chat!`);
//   });

//   // Listen for chat messages from clients
//   socket.on('chatMessage', (msg) => {
//     const username = users[socket.id]; // Get the username from the users object
//     console.log('Message received from', username, ':', msg);
    
//     // Broadcast the message to all clients along with the username
//     io.emit('message', `${username}: ${msg}`);
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     const username = users[socket.id]; // Get the username
//     delete users[socket.id]; // Remove the user from the users object
//     console.log('User disconnected:', socket.id);
    
//     // Notify all clients that a user has left
//     if (username) {
//       socket.broadcast.emit('message', `${username} has left the chat!`);
//     }
//   });
// });

// // Start the server on the desired port
// server.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });