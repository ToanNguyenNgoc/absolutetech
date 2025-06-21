import { MongoClient } from 'mongodb';

// Kết nối MongoDB
const MONGODB_URI =
  'mongodb+srv://nguyenanhduyit01:qJDIwW3sbClVOfiR@user-logs.fird3.mongodb.net/?retryWrites=true&w=majority&appName=user-logs';
const client = new MongoClient(MONGODB_URI);

async function migrateDatabase() {
  try {
    await client.connect();
    const db = client.db('intranet');

    // Migration cho collection users
    await db.collection('users').updateMany(
      {},
      {
        $rename: {
          fullName: 'full_name',
          employeeID: 'employee_id',
          nricFin: 'nric_fin',
          workPermitExpiry: 'work_permit_expiry',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          deletedAt: 'deleted_at',
        },
      },
    );
    console.log('Migrated users collection');

    // Migration cho collection user_finger
    await db.collection('user_finger').updateMany(
      {},
      {
        $rename: {
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          deletedAt: 'deleted_at',
        },
      },
    );
    console.log('Migrated user_finger collection');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateDatabase();
