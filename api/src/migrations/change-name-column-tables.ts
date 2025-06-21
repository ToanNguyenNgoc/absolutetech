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
    await db.collection('jobnumbers').updateMany(
      {},
      {
        $rename: {
          assignedTo: 'assigned_to',
          estStartDate: 'est_start_date',
          estEndDate: 'est_end_date',
          createdBy: 'created_by',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
          deletedAt: 'deleted_at',
        },
      },
    );
    await db.collection('fileuploads').updateMany(
      {},
      {
        $rename: {
          isDeleted: 'is_deleted',
          isTemp: 'is_temp',
          mineType: 'mine_type',
          refId: 'ref_id',
          refModal: 'ref_modal',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
    );

    await db.collection('documententities').updateMany(
      {},
      {
        $rename: {
          jobNumber: 'job_number',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      },
    );

    await db.collection('entry_logs').updateMany(
      {},
      {
        $rename: {
          timeIn: 'time_in',
          timeOut: 'time_out',
        },
      },
    );
    await db.collection('entry_logs_raw').updateMany(
      {},
      {
        $rename: {
          employeeNoString: 'employee_no_string',
          doorNo: 'door_no',
          currentVerifyMode: 'current_verify_mode',
        },
      },
    );
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrateDatabase();
