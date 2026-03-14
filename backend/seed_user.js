const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function createAdminUser() {
  const email = 'panchalom136@gmail.com';
  const passwordText = 'Dohapanchal@123';
  const name = 'Om Panchal';
  const role = 'Inventory Manager';

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(passwordText, salt);

  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          console.log(`User ${email} already exists.`);
        } else {
          console.error('Error inserting user:', err.message);
        }
      } else {
        console.log(`Successfully created Inventory Manager account for ${email}`);
      }
      db.close();
    }
  );
}

// Create the users table just in case it's missing (it shouldn't be, but good practice script)
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
    if (err) {
        console.error('Error creating table:', err);
        return;
    }
    createAdminUser();
  }
);
