using Cevos.Api.Models;
using Npgsql;

namespace Cevos.Api.Data;

public sealed class CatalogDatabaseStore
{
    private readonly string _connectionString;
    private readonly CatalogDataStore _fallback;
    private readonly SemaphoreSlim _initializationLock = new(1, 1);
    private bool _isInitialized;
    private bool _isAvailable;

    public CatalogDatabaseStore(IConfiguration configuration, CatalogDataStore fallback)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? string.Empty;
        _fallback = fallback;
    }

    public async Task<List<VehicleDto>> GetVehiclesAsync(string? search, string? vehicleType, int page, int pageSize)
    {
        if (!await EnsureDatabaseAsync())
        {
            return await _fallback.GetVehiclesAsync(search, vehicleType, page, pageSize);
        }

        try
        {
            await using var connection = await OpenConnectionAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = """
                  SELECT vehicle_id, make, model, trim, year, vehicle_type, body_style, drive_type,
                      wheelbase_in, length_in, width_in, height_in, curb_weight_lbs, gvwr_lbs,
                      seating_capacity, door_count, cargo_volume_ft3, recommended_battery_kwh,
                      recommended_motor_kw, estimated_range_miles, confidence_score,
                      battery_location, motor_location, electronics_location, thermal_system_location
                FROM catalog_vehicles
                WHERE (@search = '' OR make ILIKE '%' || @search || '%' OR model ILIKE '%' || @search || '%' OR CAST(year AS TEXT) LIKE '%' || @search || '%')
                  AND (@vehicle_type = '' OR vehicle_type ILIKE @vehicle_type)
                ORDER BY make, model
                OFFSET @offset ROWS FETCH NEXT @page_size ROWS ONLY;
                """;
            command.Parameters.AddWithValue("search", search?.Trim() ?? string.Empty);
            command.Parameters.AddWithValue("vehicle_type", vehicleType?.Trim() ?? string.Empty);
            command.Parameters.AddWithValue("offset", (Math.Max(1, page) - 1) * Math.Clamp(pageSize, 1, 100));
            command.Parameters.AddWithValue("page_size", Math.Clamp(pageSize, 1, 100));

            var vehicles = new List<VehicleDto>();
            await using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                vehicles.Add(MapVehicle(reader));
            }

            return vehicles;
        }
        catch (NpgsqlException)
        {
            _isAvailable = false;
            return await _fallback.GetVehiclesAsync(search, vehicleType, page, pageSize);
        }
    }

    public async Task<VehicleDto?> GetVehicleByIdAsync(int id)
    {
        if (!await EnsureDatabaseAsync())
        {
            return await _fallback.GetVehicleByIdAsync(id);
        }

        try
        {
            await using var connection = await OpenConnectionAsync();
            await using var command = connection.CreateCommand();
            command.CommandText = """
                  SELECT vehicle_id, make, model, trim, year, vehicle_type, body_style, drive_type,
                      wheelbase_in, length_in, width_in, height_in, curb_weight_lbs, gvwr_lbs,
                      seating_capacity, door_count, cargo_volume_ft3, recommended_battery_kwh,
                      recommended_motor_kw, estimated_range_miles, confidence_score,
                      battery_location, motor_location, electronics_location, thermal_system_location
                FROM catalog_vehicles
                WHERE vehicle_id = @id;
                """;
            command.Parameters.AddWithValue("id", id);
            await using var reader = await command.ExecuteReaderAsync();
            return await reader.ReadAsync() ? MapVehicle(reader) : null;
        }
        catch (NpgsqlException)
        {
            _isAvailable = false;
            return await _fallback.GetVehicleByIdAsync(id);
        }
    }

    private async Task<bool> EnsureDatabaseAsync()
    {
        if (_isInitialized)
        {
            return _isAvailable;
        }

        await _initializationLock.WaitAsync();
        try
        {
            if (_isInitialized)
            {
                return _isAvailable;
            }

            if (string.IsNullOrWhiteSpace(_connectionString))
            {
                _isInitialized = true;
                return false;
            }

            try
            {
                await using var connection = await OpenConnectionAsync();
                await using var command = connection.CreateCommand();
                command.CommandText = """
                    CREATE TABLE IF NOT EXISTS catalog_vehicles (
                        vehicle_id INTEGER PRIMARY KEY,
                        make TEXT NOT NULL,
                        model TEXT NOT NULL,
                        trim TEXT NOT NULL DEFAULT '',
                        year INTEGER NOT NULL,
                        vehicle_type TEXT NOT NULL DEFAULT '',
                        body_style TEXT NOT NULL DEFAULT '',
                        drive_type TEXT NOT NULL DEFAULT '',
                        wheelbase_in NUMERIC NOT NULL DEFAULT 0,
                        length_in NUMERIC NOT NULL DEFAULT 0,
                        width_in NUMERIC NOT NULL DEFAULT 0,
                        height_in NUMERIC NOT NULL DEFAULT 0,
                        curb_weight_lbs INTEGER NOT NULL DEFAULT 0,
                        gvwr_lbs INTEGER NOT NULL DEFAULT 0,
                        seating_capacity INTEGER NOT NULL DEFAULT 0,
                        door_count INTEGER NOT NULL DEFAULT 0,
                        cargo_volume_ft3 NUMERIC NOT NULL DEFAULT 0,
                        recommended_battery_kwh INTEGER NOT NULL DEFAULT 0,
                        recommended_motor_kw INTEGER NOT NULL DEFAULT 0,
                        estimated_range_miles INTEGER NOT NULL DEFAULT 0,
                        confidence_score INTEGER NOT NULL DEFAULT 0,
                        battery_location TEXT NOT NULL DEFAULT '',
                        motor_location TEXT NOT NULL DEFAULT '',
                        electronics_location TEXT NOT NULL DEFAULT '',
                        thermal_system_location TEXT NOT NULL DEFAULT ''
                    );
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS wheelbase_in NUMERIC NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS length_in NUMERIC NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS width_in NUMERIC NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS height_in NUMERIC NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS gvwr_lbs INTEGER NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS door_count INTEGER NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS cargo_volume_ft3 NUMERIC NOT NULL DEFAULT 0;
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS battery_location TEXT NOT NULL DEFAULT '';
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS motor_location TEXT NOT NULL DEFAULT '';
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS electronics_location TEXT NOT NULL DEFAULT '';
                    ALTER TABLE catalog_vehicles ADD COLUMN IF NOT EXISTS thermal_system_location TEXT NOT NULL DEFAULT '';
                    """;
                await command.ExecuteNonQueryAsync();
                await SeedIfEmptyAsync(connection);
                _isAvailable = true;
            }
            catch (NpgsqlException)
            {
                _isAvailable = false;
            }

            _isInitialized = true;
            return _isAvailable;
        }
        finally
        {
            _initializationLock.Release();
        }
    }

    private async Task SeedIfEmptyAsync(NpgsqlConnection connection)
    {
        await using var countCommand = connection.CreateCommand();
        countCommand.CommandText = "SELECT COUNT(*) FROM catalog_vehicles;";
        var count = (long)(await countCommand.ExecuteScalarAsync() ?? 0L);
        if (count > 0)
        {
            return;
        }

        var vehicles = await _fallback.GetVehiclesAsync(null, null, 1, 100);
        await using var transaction = await connection.BeginTransactionAsync();
        foreach (var vehicle in vehicles)
        {
            await using var command = connection.CreateCommand();
            command.Transaction = transaction;
            command.CommandText = """
                INSERT INTO catalog_vehicles (
                    vehicle_id, make, model, trim, year, vehicle_type, body_style, drive_type,
                    wheelbase_in, length_in, width_in, height_in, curb_weight_lbs, gvwr_lbs,
                    seating_capacity, door_count, cargo_volume_ft3, recommended_battery_kwh,
                    recommended_motor_kw, estimated_range_miles, confidence_score,
                    battery_location, motor_location, electronics_location, thermal_system_location
                ) VALUES (@id, @make, @model, @trim, @year, @vehicle_type, @body_style, @drive_type,
                          @wheelbase_in, @length_in, @width_in, @height_in, @curb_weight_lbs, @gvwr_lbs,
                          @seating_capacity, @door_count, @cargo_volume_ft3, @recommended_battery_kwh,
                          @recommended_motor_kw, @estimated_range_miles, @confidence_score,
                          @battery_location, @motor_location, @electronics_location, @thermal_system_location);
                """;
            command.Parameters.AddWithValue("id", vehicle.Id);
            command.Parameters.AddWithValue("make", vehicle.Make);
            command.Parameters.AddWithValue("model", vehicle.Model);
            command.Parameters.AddWithValue("trim", vehicle.Trim);
            command.Parameters.AddWithValue("year", vehicle.Year);
            command.Parameters.AddWithValue("vehicle_type", vehicle.VehicleType);
            command.Parameters.AddWithValue("body_style", vehicle.BodyStyle);
            command.Parameters.AddWithValue("drive_type", vehicle.DriveType);
            command.Parameters.AddWithValue("wheelbase_in", vehicle.WheelbaseIn);
            command.Parameters.AddWithValue("length_in", vehicle.LengthIn);
            command.Parameters.AddWithValue("width_in", vehicle.WidthIn);
            command.Parameters.AddWithValue("height_in", vehicle.HeightIn);
            command.Parameters.AddWithValue("curb_weight_lbs", vehicle.CurbWeightLbs);
            command.Parameters.AddWithValue("gvwr_lbs", vehicle.GVWRLbs);
            command.Parameters.AddWithValue("seating_capacity", vehicle.SeatingCapacity);
            command.Parameters.AddWithValue("door_count", vehicle.DoorCount);
            command.Parameters.AddWithValue("cargo_volume_ft3", vehicle.CargoVolumeFt3);
            command.Parameters.AddWithValue("recommended_battery_kwh", vehicle.RecommendedBatteryKWh);
            command.Parameters.AddWithValue("recommended_motor_kw", vehicle.RecommendedMotorKW);
            command.Parameters.AddWithValue("estimated_range_miles", vehicle.EstimatedRangeMiles);
            command.Parameters.AddWithValue("confidence_score", vehicle.ConfidenceScore);
            command.Parameters.AddWithValue("battery_location", vehicle.BatteryLocation);
            command.Parameters.AddWithValue("motor_location", vehicle.MotorLocation);
            command.Parameters.AddWithValue("electronics_location", vehicle.ElectronicsLocation);
            command.Parameters.AddWithValue("thermal_system_location", vehicle.ThermalSystemLocation);
            await command.ExecuteNonQueryAsync();
        }

        await transaction.CommitAsync();
    }

    private async Task<NpgsqlConnection> OpenConnectionAsync()
    {
        var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        return connection;
    }

    private static VehicleDto MapVehicle(NpgsqlDataReader reader) => new()
    {
        Id = reader.GetInt32(0),
        Make = reader.GetString(1),
        Model = reader.GetString(2),
        Trim = reader.GetString(3),
        Year = reader.GetInt32(4),
        VehicleType = reader.GetString(5),
        BodyStyle = reader.GetString(6),
        DriveType = reader.GetString(7),
        WheelbaseIn = reader.GetDecimal(8),
        LengthIn = reader.GetDecimal(9),
        WidthIn = reader.GetDecimal(10),
        HeightIn = reader.GetDecimal(11),
        CurbWeightLbs = reader.GetInt32(12),
        GVWRLbs = reader.GetInt32(13),
        SeatingCapacity = reader.GetInt32(14),
        DoorCount = reader.GetInt32(15),
        CargoVolumeFt3 = reader.GetDecimal(16),
        RecommendedBatteryKWh = reader.GetInt32(17),
        RecommendedMotorKW = reader.GetInt32(18),
        EstimatedRangeMiles = reader.GetInt32(19),
        ConfidenceScore = reader.GetInt32(20),
        BatteryLocation = reader.GetString(21),
        MotorLocation = reader.GetString(22),
        ElectronicsLocation = reader.GetString(23),
        ThermalSystemLocation = reader.GetString(24),
        ImageUrl = "/images/qx60.jpg"
    };
}
