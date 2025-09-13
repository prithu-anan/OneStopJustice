// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the justice database
db = db.getSiblingDB('justice');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        },
        password: {
          bsonType: "string",
          minLength: 6
        },
        role: {
          bsonType: "string",
          enum: ["citizen", "police", "judge", "lawyer", "admin"]
        }
      }
    }
  }
});

db.createCollection('complaints');
db.createCollection('grievances');
db.createCollection('cases');
db.createCollection('notifications');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.complaints.createIndex({ "citizenId": 1 });
db.complaints.createIndex({ "status": 1 });
db.complaints.createIndex({ "createdAt": -1 });
db.grievances.createIndex({ "citizenId": 1 });
db.grievances.createIndex({ "status": 1 });
db.grievances.createIndex({ "createdAt": -1 });
db.cases.createIndex({ "caseNumber": 1 }, { unique: true });
db.cases.createIndex({ "status": 1 });
db.cases.createIndex({ "createdAt": -1 });
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "createdAt": -1 });

print('MongoDB initialization completed successfully!');
