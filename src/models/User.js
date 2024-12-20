import db from "../config/db.js"; // Your already established MySQL connection

// Function to check if username exists in the database
export const findUserByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE name = ?";
    db.query(query, [username], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]); // Return the first match (user)
    });
  });
};

// Function to create a new user in the database
export const createUser = async (username, email, hashedPassword, role) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";
    db.query(query, [username, email, hashedPassword, role], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
