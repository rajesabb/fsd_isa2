# Pharmacy Medicine Refill Reminder API

REST API built with Node.js, Express, Sequelize, and MySQL. It manages patients, their prescriptions, and prescription refill alerts.

## Setup

1. Install Node.js and MySQL, then create the project database user with permission to create and alter tables.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` to your local MySQL settings.
4. Create the database and run migrations:

   ```bash
   npm run db:create
   npm run db:migrate
   ```

5. Start the API:

   ```bash
   npm start
   ```

The server listens on `http://localhost:3000` by default. Set `PORT` to change it. `npm run dev` starts Node's watch mode. The API verifies the MySQL connection before it starts listening.

## Relationships

- A patient has many prescriptions; each prescription belongs to one patient.
- A prescription has many refill alerts; each alert belongs to one prescription.
- Deleting a patient or prescription cascades to its dependent records.
- Creating a prescription schedules a pending reminder seven days before its refill date. Updating that date schedules another reminder; both writes are committed in one transaction.

Patient email is unique. Required fields, email format, integer foreign keys, and prescription/alert statuses are validated by Sequelize; foreign keys and non-null requirements are enforced by the database migrations as well.

## API

All request and response bodies use JSON. IDs are integer primary keys. Error responses have the form `{"error":"..."}`.

### Patients

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/patients` | List patients |
| POST | `/api/patients` | Create a patient; returns `201` |
| GET | `/api/patients/:id` | Get a patient; returns `404` if missing |
| PUT | `/api/patients/:id` | Update a patient's name, email, and phone |
| DELETE | `/api/patients/:id` | Delete a patient and dependent records |

Example patient body:

```json
{
  "name": "Asha Patel",
  "email": "asha@example.com",
  "phone": "9876543210"
}
```

### Prescriptions

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/prescriptions` | List prescriptions with patient details |
| POST | `/api/prescriptions` | Create an active prescription; returns `201` |
| GET | `/api/prescriptions/:id` | Get a prescription with its patient and refill alerts |
| PUT | `/api/prescriptions/:id` | Update prescription details; changing `refillDate` schedules another reminder |
| GET | `/api/prescriptions/patient/:patientId` | List prescriptions for one patient |
| GET | `/api/prescriptions/due-refills` | List active prescriptions whose `refillDate` is now or earlier, with patient details |
| PATCH | `/api/prescriptions/:id/status` | Set status to `active`, `completed`, or `cancelled` |
| DELETE | `/api/prescriptions/:id` | Delete a prescription and its alerts |

Example prescription body:

```json
{
  "patientId": 1,
  "medicineName": "Paracetamol",
  "dosage": "500 mg",
  "frequency": "Twice daily",
  "refillDate": "2026-11-01"
}
```

Status update body: `{"status":"completed"}`.

The `PUT` request accepts the same fields as prescription creation, including `patientId`, `medicineName`, `dosage`, `frequency`, and `refillDate`.

### Refill alerts

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/refill-alerts` | List alerts with prescription details |
| POST | `/api/refill-alerts` | Create an alert; returns `201` |
| GET | `/api/refill-alerts/prescription/:prescriptionId` | List alerts for one prescription |
| PATCH | `/api/refill-alerts/:id/status` | Set status to `pending`, `sent`, or `completed` |
| DELETE | `/api/refill-alerts/:id` | Delete an alert |

Example alert body:

```json
{
  "prescriptionId": 1,
  "alertDate": "2026-10-25T09:00:00.000Z",
  "message": "Your Paracetamol refill is due soon."
}
```

### Responses

- `200`: successful read, update, or delete
- `201`: record created
- `400`: invalid request or model validation failure
- `404`: requested patient, prescription, or alert does not exist
- `500`: unexpected server or database error

## Database Migrations

Migration files create the patient, prescription, and refill-alert tables in foreign-key order. To inspect or undo migrations, use `npx sequelize-cli db:migrate:status` or `npm run db:migrate:undo`. The patient migration expects a fresh schema; if it was already run against an older schema, back up the data and reconcile that schema before applying the corrected migration.