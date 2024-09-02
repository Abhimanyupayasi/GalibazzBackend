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
 console.log("jwtksuri file main ", process.env.AUTH0_JWKS_URI);
 console.log("jwtksuri file main", process.env.AUTH0_AUDIENCE);
  

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




const port = 3000;


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

