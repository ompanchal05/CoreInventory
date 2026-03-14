const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function createStaffUser() {
  const email = 'yugzadafiya@gmail.com';
  const passwordText = 'YugZadafiya@123';
  const name = 'Yug Zadafiya';
  const role = 'Warehouse Staff';

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
        console.log(`Successfully created Warehouse Staff account for ${email}`);
      }
      db.close();
    }
  );
}

createStaffUser();
