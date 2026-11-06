# Backend Database Setup

The API reads its PostgreSQL connection string from `ConnectionStrings:DefaultConnection`. The migration command below reads `CEVOS_DATABASE_URL`; configure both to point to the same database.

## Local Setup

1. Install PostgreSQL and create a database named `cevos`.
2. Configure the API connection string using local user secrets or the `ConnectionStrings__DefaultConnection` environment variable. Set `CEVOS_DATABASE_URL` for the migration command. Do not commit real credentials.
3. Apply the project schema foundation from the API project directory:

	```bash
	psql "$CEVOS_DATABASE_URL" -v ON_ERROR_STOP=1 -f Migrations/001_CreateCevosProjects.sql
	```

4. Run the API with `dotnet run`.

The migration creates an additive `cevos_projects` table and does not modify the legacy catalog/project tables. The current API still uses `InMemoryProjectRepository`; applying this migration does not yet make project CRUD durable. Repository integration is a separate implementation task.

## Rollback

Application rollback is non-destructive: deploy the previous API version and leave `cevos_projects` in place. Do not drop the table in an environment that may contain project data. For a disposable development database only, remove the table with:

```sql
DROP TABLE IF EXISTS cevos_projects;
```

## Example Connection String

Host=localhost;Port=5432;Database=cevos;Username=your-user;Password=your-password

## Simulator Example

Example range calculation:

- Battery capacity: 95 kWh
- Efficiency: 3.0 miles/kWh
- Estimated range: 285 miles
