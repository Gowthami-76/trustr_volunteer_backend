# trustr_volunteer_backend

Below are the steps to setup developer environment.

1. Configure local git repository
   ```
   git clone https://github.com/innData-Analytics/trustr_volunteer_backend
   ```
2. Install **[Node.js](https://nodejs.org/en/download/package-manager/)** _(Note: use nodejs v18.15.0)_

3. Install **postgres DB**:

   ```
   sudo apt install postgresql postgresql-contrib
   ```
   
   Ensure a role with name `postgres` and password `postgres` is created after installation ([reference](https://www.postgresql.org/docs/8.1/static/sql-createrole.html)).

4. Install **pgadmin3**:

   ```
   sudo apt install pgadmin3
   ```
   
5. Create a database named `trustrdb` for role `postgres` ([reference](https://www.postgresql.org/docs/9.0/static/sql-createdatabase.html)).

   > _Note: In case you are using a different role/database name you need to update database connection string in environment/development.js file_ `postgres://<username>:<password>@<hostname>:5432/<db-name>`
Go to the base directory of the project:

7. Generate models from db:

   ```
   sequelize-auto -o "./output-folder" -d <database> -h <hostname> -u <username> -p 5432 -x <password> -e postgres
   ```

8. Apply DB migrations:

   ```
   sequelize db:migrate
   ```

9. Install packages as user with root privileges: `npm install`

10. Start back-end API server:  
    `npm run dev` (For windows: `npm run dev_win`)

You're good to go.
