const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'coreinventory_super_secret_key_2026'; // In production, use env variables

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create Users table
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error('Error creating users table:', err.message);
      }
    );
    // Create Picking Tasks table
    db.run(
      `CREATE TABLE IF NOT EXISTS picking_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        location TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users (id)
      )`,
      (err) => {
        if (err) console.error('Error creating picking_tasks table:', err.message);
        else {
          // Seed some initial demo data if the table is empty
          db.get('SELECT count(*) as count FROM picking_tasks', (err, row) => {
            if (row && row.count === 0) {
              const stmt = db.prepare('INSERT INTO picking_tasks (item_name, location, quantity) VALUES (?, ?, ?)');
              stmt.run('Industrial Bearings', 'WH-A / Rack 12', 500);
              stmt.run('Copper Wire 12AWG', 'WH-A / Rack 4', 100);
              stmt.run('Packaging Tape', 'WH-C / Bin 2', 50);
              stmt.run('Hydraulic Valves', 'WH-A / Rack 18', 25);
              stmt.finalize();
              console.log('Seeded initial picking tasks.');
            }
          });
        }
      }
    );
    // Create Products table
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        sku TEXT UNIQUE NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        location TEXT NOT NULL,
        category TEXT,
        low_stock BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error('Error creating products table:', err.message);
        else {
          db.get('SELECT count(*) as count FROM products', (err, row) => {
            if (row && row.count === 0) {
              const stmt = db.prepare('INSERT INTO products (name, sku, quantity, location, category, low_stock) VALUES (?, ?, ?, ?, ?, ?)');
              stmt.run('Industrial Bearings', 'BRG-4821', 2450, 'WH-A / Rack 12', 'Spare Parts', 0);
              stmt.run('Safety Helmets (Yellow)', 'PPE-1037', 12, 'WH-B / Shelf 4', 'Consumables', 1);
              stmt.run('Copper Wire 12AWG', 'WIR-7753', 120, 'WH-A / Rack 4', 'Raw Materials', 0);
              stmt.run('Packaging Tape (Clear)', 'PKG-2204', 5, 'WH-C / Bin 2', 'Consumables', 1);
              stmt.run('Hydraulic Valves', 'VAL-9921', 86, 'WH-A / Rack 18', 'Spare Parts', 0);
              stmt.finalize();
              console.log('Seeded initial products.');
            }
          });
        }
      }
    );
    // Create Packing Tasks table
    db.run(
      `CREATE TABLE IF NOT EXISTS packing_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_ref TEXT NOT NULL,
        item_count INTEGER NOT NULL,
        destination TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error('Error creating packing_tasks table:', err.message);
        else {
          db.get('SELECT count(*) as count FROM packing_tasks', (err, row) => {
            if (row && row.count === 0) {
              const stmt = db.prepare('INSERT INTO packing_tasks (order_ref, item_count, destination) VALUES (?, ?, ?)');
              stmt.run('ORD-5501', 3, 'Site Alpha');
              stmt.run('ORD-5502', 12, 'Customer XYZ');
              stmt.run('ORD-5503', 1, 'Site Beta');
              stmt.finalize();
              console.log('Seeded initial packing tasks.');
            }
          });
        }
      }
    );
    // Create Receiving Tasks table
    db.run(
      `CREATE TABLE IF NOT EXISTS receiving_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        supplier TEXT NOT NULL,
        expected_items INTEGER NOT NULL,
        dock TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error('Error creating receiving_tasks table:', err.message);
        else {
          db.get('SELECT count(*) as count FROM receiving_tasks', (err, row) => {
            if (row && row.count === 0) {
              const stmt = db.prepare('INSERT INTO receiving_tasks (supplier, expected_items, dock) VALUES (?, ?, ?)');
              stmt.run('SKF Bearings', 2, 'Dock 1');
              stmt.run('3M Industrial', 5, 'Dock 3');
              stmt.run('General Electric', 1, 'Dock 2');
              stmt.run('Valves Corp', 15, 'Dock 1');
              stmt.finalize();
              console.log('Seeded initial receiving tasks.');
            }
          });
        }
      }
    );
    // Create Count Tasks table
    db.run(
      `CREATE TABLE IF NOT EXISTS count_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location TEXT NOT NULL,
        system_qty INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) console.error('Error creating count_tasks table:', err.message);
        else {
          db.get('SELECT count(*) as count FROM count_tasks', (err, row) => {
            if (row && row.count === 0) {
              const stmt = db.prepare('INSERT INTO count_tasks (location, system_qty) VALUES (?, ?)');
              stmt.run('WH-B / Shelf 4', 12);
              stmt.run('WH-A / Rack 1', 1500);
              stmt.run('WH-C / Bin 8', 45);
              stmt.finalize();
              console.log('Seeded initial count tasks.');
            }
          });
        }
      }
    );
  }
});

// --- MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// --- AUTH ROUTES ---

// Signup Endpoint
// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while checking user.' });
      }
      if (row) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user
      const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      const userRole = role || 'Inventory Manager';
      const userName = name || email.split('@')[0];

      db.run(sql, [userName, email, hashedPassword, userRole], function (err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user.' });
        }

        // Generate JWT
        const token = jwt.sign(
          { id: this.lastID, email, name: userName, role: userRole },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: { id: this.lastID, name: userName, email, role: userRole }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// Login Endpoint
// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password, role: requestedRole } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error during login.' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    try {
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      // Role Authentication Logic:
      // - Inventory Manager (like 'om') can log in as BOTH Inventory Manager and Warehouse Staff.
      // - Warehouse Staff (like 'yug') can ONLY log in as Warehouse Staff.
      const dbRole = user.role;
      let assignedRole = dbRole;

      if (requestedRole) {
        if (dbRole === 'Warehouse Staff' && requestedRole === 'Inventory Manager') {
          return res.status(403).json({ error: 'Access Denied: You do not have permission to log in as an Inventory Manager.' });
        }
        // If they requested a valid role they have access to, use it for this session
        assignedRole = requestedRole;
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: assignedRole },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: assignedRole }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error during password verification.' });
    }
  });
});

// --- WAREHOUSE OPERATIONS ROUTES ---

// Get all pending picking tasks
// GET /api/tasks/picking
app.get('/api/tasks/picking', authenticateToken, (req, res) => {
  db.all("SELECT * FROM picking_tasks WHERE status = 'pending'", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error fetching tasks.' });
    }
    res.json(rows);
  });
});

// Complete a picking task
// POST /api/tasks/picking/:id/complete
app.post('/api/tasks/picking/:id/complete', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id; // From authenticateToken middleware

  db.run(
    "UPDATE picking_tasks SET status = 'completed', assigned_to = ? WHERE id = ? AND status = 'pending'",
    [userId, taskId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating task.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found or already completed.' });
      }
      res.json({ message: 'Task marked as completed', id: taskId });
    }
  );
});

// --- PRODUCTS ROUTES ---

// Get all products
app.get('/api/products', authenticateToken, (req, res) => {
  db.all("SELECT * FROM products ORDER BY name ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching products.' });
    res.json(rows);
  });
});

// Add a new product
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, sku, quantity, location, category, low_stock } = req.body;
  
  if (!name || !sku) {
    return res.status(400).json({ error: 'Product name and SKU are required.' });
  }

  const sql = 'INSERT INTO products (name, sku, quantity, location, category, low_stock) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, sku, quantity || 0, location || 'Unassigned', category || 'General', low_stock ? 1 : 0], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'A product with this SKU already exists.' });
      }
      return res.status(500).json({ error: 'Failed to add product.' });
    }
    res.status(201).json({ message: 'Product added successfully', id: this.lastID });
  });
});

// Update an existing product
// PUT /api/products/:id
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, quantity, location, category } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Product name is required.' });
  }

  const lowStock = quantity !== undefined && parseInt(quantity) < 20 ? 1 : 0;
  const sql = 'UPDATE products SET name = ?, quantity = ?, location = ?, category = ?, low_stock = ? WHERE id = ?';

  db.run(sql, [name, quantity || 0, location || 'Unassigned', category || 'General', lowStock, id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update product.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product updated successfully' });
  });
});

// Delete a product
// DELETE /api/products/:id
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete product.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product deleted successfully' });
  });
});

// --- PACKING TASKS ROUTES ---

app.get('/api/tasks/packing', authenticateToken, (req, res) => {
  db.all("SELECT * FROM packing_tasks WHERE status = 'pending'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching tasks.' });
    res.json(rows);
  });
});

app.post('/api/tasks/packing/:id/complete', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  db.run("UPDATE packing_tasks SET status = 'completed', assigned_to = ? WHERE id = ? AND status = 'pending'", [userId, taskId], function(err) {
    if (err) return res.status(500).json({ error: 'Error updating task.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found or already completed.' });
    res.json({ message: 'Packing task completed', id: taskId });
  });
});

// --- RECEIVING TASKS ROUTES ---

app.get('/api/tasks/receiving', authenticateToken, (req, res) => {
  db.all("SELECT * FROM receiving_tasks WHERE status = 'pending'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching tasks.' });
    res.json(rows);
  });
});

app.post('/api/tasks/receiving/:id/complete', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  db.run("UPDATE receiving_tasks SET status = 'completed', assigned_to = ? WHERE id = ? AND status = 'pending'", [userId, taskId], function(err) {
    if (err) return res.status(500).json({ error: 'Error updating task.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found or already completed.' });
    res.json({ message: 'Receiving task completed', id: taskId });
  });
});

// --- COUNT TASKS ROUTES ---

app.get('/api/tasks/count', authenticateToken, (req, res) => {
  db.all("SELECT * FROM count_tasks WHERE status = 'pending'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error fetching tasks.' });
    res.json(rows);
  });
});

app.post('/api/tasks/count/:id/complete', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  db.run("UPDATE count_tasks SET status = 'completed', assigned_to = ? WHERE id = ? AND status = 'pending'", [userId, taskId], function(err) {
    if (err) return res.status(500).json({ error: 'Error updating task.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found or already completed.' });
    res.json({ message: 'Count task completed', id: taskId });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
