using Cevos.Api.Data;
using Cevos.Api.Endpoints;
using Cevos.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSingleton<CatalogDataStore>();
builder.Services.AddSingleton<CatalogDatabaseStore>();
builder.Services.AddSingleton<IProjectRepository, InMemoryProjectRepository>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapProjectEndpoints();

app.MapGet("/api/vehicles", async (CatalogDatabaseStore store, string? search, string? vehicleType, int page = 1, int pageSize = 20) =>
{
    var vehicles = await store.GetVehiclesAsync(search, vehicleType, page, pageSize);
    return Results.Ok(vehicles);
});

app.MapGet("/api/vehicles/{id:int}", async (int id, CatalogDatabaseStore store) =>
{
    var vehicle = await store.GetVehicleByIdAsync(id);
    return vehicle is null ? Results.NotFound() : Results.Ok(vehicle);
});

app.MapGet("/api/batteries", async (CatalogDataStore store) =>
{
    var batteries = await store.GetBatteriesAsync();
    return Results.Ok(batteries);
});

app.MapGet("/api/motors", async (CatalogDataStore store) =>
{
    var motors = await store.GetMotorsAsync();
    return Results.Ok(motors);
});

app.Run();

public partial class Program;
