// auth.js
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

// Middleware to validate JWT
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-1icoa2n0syt0uc7j.us.auth0.com/.well-known/openid-configuration`
  }),

  // Validate the audience and the issuer
  audience: 'https://dev-1icoa2n0syt0uc7j.us.auth0.com/api/v2/',
  issuer: `https://dev-1icoa2n0syt0uc7j.us.auth0.com/api/v2/`,
  algorithms: ['RS256']
});

module.exports = checkJwt;
