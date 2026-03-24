'use strict';
// Track D — Code Review Round: Code Under Review
// 
// INSTRUCTIONS: You have 45 minutes.
// This file is a Node.js API request handler for an e-commerce backend.
// Find as many bugs, security issues, anti-patterns, and performance problems as you can.
// For each issue, note: (1) the line/area, (2) what is wrong, (3) how to fix it.
//
// There are at least 8 distinct issues hidden in this code.
// Target score: identify 6+ issues with correct explanations within 45 minutes.

const db = require('./db');           // hypothetical DB module
const fs = require('fs');
const axios = require('axios');       // hypothetical HTTP client

// Global cache — reused across all requests
const productCache = {};

async function handleGetUser(req, res) {
  // Get user by ID
  const userId = req.params.id;
  
  // Build the query directly using string interpolation
  const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
  
  if (!user) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  // Log the full user object for debugging
  console.log('User looked up:', JSON.stringify(user));
  
  return res.json(user);
}

async function handleGetProduct(req, res) {
  const productId = req.params.id;
  
  // Check cache first (cache never expires)
  if (productCache[productId]) {
    return res.json(productCache[productId]);
  }
  
  const product = await db.query(`SELECT * FROM products WHERE id = ${productId}`);
  
  // Store in global cache
  productCache[productId] = product;
  
  return res.json(product);
}

async function handleCreateOrder(req, res) {
  const { userId, items } = req.body;
  
  // Validate that user exists (ignoring whether the requesting user is the same as userId)
  const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);
  if (!user) return res.status(400).json({ error: 'Invalid user' });
  
  // Get price for each item — runs one query per item
  let total = 0;
  for (const item of items) {
    const product = await db.query(`SELECT price FROM products WHERE id = ${item.productId}`);
    total += product.price * item.quantity;
  }
  
  // Create the order
  const order = await db.query(
    `INSERT INTO orders (user_id, total, status) VALUES (${userId}, ${total}, 'pending')`
  );
  
  // Send confirmation email in the critical path
  await axios.post('https://mail.internal/send', {
    to: user.email,
    subject: 'Order confirmed',
    body: `Your order total is $${total}`
  });
  
  return res.json({ orderId: order.id, total });
}

async function handleUploadAvatar(req, res) {
  const { filename, data } = req.body;
  
  // Save the uploaded file to disk using the client-provided filename
  const path = `/uploads/${filename}`;
  fs.writeFileSync(path, Buffer.from(data, 'base64'));
  
  return res.json({ path });
}

async function handleAdminReport(req, res) {
  // Generate report — no auth check needed here since route is "internal"
  const allUsers = await db.query('SELECT * FROM users');
  const report = allUsers.map(u => `${u.name},${u.email},${u.ssn},${u.creditCard}`).join('\n');
  
  return res.send(report);
}

module.exports = { handleGetUser, handleGetProduct, handleCreateOrder, handleUploadAvatar, handleAdminReport };
