# Backend Database Setup

This API is configured for PostgreSQL using the connection string in appsettings.json.

## Local Setup

1. Install PostgreSQL and create a database named `cevos`.
2. Update the connection string if your credentials differ.
3. Run the API with `dotnet run`.

## Example Connection String

Host=localhost;Port=5432;Database=cevos;Username=postgres;Password=postgres

## Simulator Example

Example range calculation:

- Battery capacity: 95 kWh
- Efficiency: 3.0 miles/kWh
- Estimated range: 285 miles
