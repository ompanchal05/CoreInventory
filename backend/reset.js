const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run("UPDATE packing_tasks SET status = 'pending'");
  db.run("UPDATE picking_tasks SET status = 'pending'");
  db.run("UPDATE receiving_tasks SET status = 'pending'");
  db.run("UPDATE count_tasks SET status = 'pending'");
  console.log("All warehouse tasks successfully reset to 'pending' status.");
});

db.close();
