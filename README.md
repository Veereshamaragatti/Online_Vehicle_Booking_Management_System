##########################################################################################################
🚗 Online Vehicle Booking Management System
##########################################################################################################

A simple vehicle booking system where an Admin can register vehicles for rent and Users can view
and request vehicles for specific dates. The Admin reviews requests and approves or rejects them based
on vehicle availability.

## Tech Stack

- Frontend: ReactJS (client and admin apps)
- Backend: ExpressJS (Node)
- Database: MySQL

## Quick Start

These steps assume you have Git, Node.js (with npm) and MySQL installed on your machine.

1. Clone the repository

```powershell
git clone https://github.com/Veereshamaragatti/Online_Vehicle_Booking_Management_System.git
cd Online_Vehicle_Booking_Management_System/OVBMS
```

2. Import the MySQL database

Import the SQL dump located at `Database/ovbms.sql` into your local MySQL server. Use your preferred method:

- Using the mysql CLI (replace user/db as needed):

```powershell
mysql -u root -p < Database\ovbms.sql
# or if mysql is not on PATH (example Windows path):
& '"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"' -u root -p < Database\ovbms.sql
```

- Or use MySQL Workbench / phpMyAdmin and import the `Database/ovbms.sql` file.

Note: If you see errors related to DEFINER, events, or permissions, import using a privileged account (root) or remove/adjust DEFINER lines in the dump.

3. Install dependencies

Open three separate terminals and run the following in each project subfolder.

Server:
```powershell
cd server
npm install
```

Admin (React dashboard):
```powershell
cd admin
npm install
```

Client (React user UI):
```powershell
cd client
npm install
```

4. Run the services

Start each service in its terminal.

Server:
```powershell
cd server
npm start
```

Admin UI (runs on PORT 4000 by default per `admin/package.json`):
```powershell
cd admin
npm start
```

Client UI:
```powershell
cd client
npm start
```

If any of the apps fail to start, check the terminal logs for errors (missing env vars, DB connection issues, or port conflicts).

## Configuration

- Database credentials used by the backend are located in `server/server.js`. For local development, you can update the `host`, `user`, `password`, and `database` fields there. For better security, consider switching to environment variables (e.g., using `dotenv`).
- The server expects two MySQL users in the provided dump (`client` and `admin`), but you can use your own users as long as privileges are set appropriately.

## Default Credentials (development)

- Admin: `admin@gmail.com` / `admin123`
- User: `user1@gmail.com` / `user1`

These are seeded in the SQL dump and are intended for local development only.

## Project Structure

```
OVBMS/
├── Database/       # SQL dump: ovbms.sql
├── server/         # Express backend
├── admin/          # Admin React app
└── client/         # Client React app
```

## Notes & Troubleshooting

- Ensure MySQL server is running before starting the backend.
- If you have errors connecting from the server to MySQL, confirm the credentials in `server/server.js` and that the MySQL user has the required privileges on the `ovbms` database.
- The admin front-end runs on port 4000 by default (see `admin/package.json`). The client runs on the default React port (3000).
- If you see signup or insert errors related to column sizes (e.g., `ER_DATA_TOO_LONG`), inspect the schema in MySQL and adjust column sizes or input values accordingly.

## Recommended next steps

- Move DB credentials into a `.env` file and use `dotenv` in `server/server.js`.
- Add a server endpoint that returns joined booking+vehicle data to avoid multiple round trips from the client.

## License

This repository is provided as-is for educational/demo purposes.

##########################################################################################################
