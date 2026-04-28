const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employ",
});

const correctHash =
  "$2a$10$B/y1jbTLhKsdKiramWypB./v7vC5q87xms/MbmO.f.xwORDP86isO";

conn.query(
  "UPDATE Users SET password = ? WHERE username = ?",
  [correctHash, "admin"],
  (err, result) => {
    if (err) {
      console.error("Error:", err);
      process.exit(1);
    }
    console.log("✅ Admin password updated successfully");
    console.log("Updated rows:", result.affectedRows);

    // Verify
    conn.query(
      "SELECT username, password FROM Users WHERE username = ?",
      ["admin"],
      (err, rows) => {
        if (err) {
          console.error("Error:", err);
          process.exit(1);
        }
        console.log("✅ Current admin record:", rows[0]);
        conn.end();
      },
    );
  },
);
