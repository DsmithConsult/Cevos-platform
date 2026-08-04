using Cevos.Api.Models;

namespace Cevos.Api.Data;

public class CatalogDataStore
{
    private readonly List<Vehicle> _vehicles = new()
    {
        new Vehicle
        {
            Id = 1,
            Make = "Infiniti",
            Model = "QX60",
            Trim = "AWD",
            Year = 2017,
            VehicleType = "SUV",
            BodyStyle = "Crossover",
            DriveType = "AWD",
            WheelbaseIn = 114.2m,
            LengthIn = 196.4m,
            WidthIn = 77.2m,
            HeightIn = 68.6m,
            CurbWeightLbs = 4385,
            GVWRLbs = 5986,
            SeatingCapacity = 7,
            DoorCount = 4,
            CargoVolumeFt3 = 16.0m,
            RecommendedBatteryKWh = 95,
            RecommendedMotorKW = 250,
            EstimatedRangeMiles = 285,
            ConfidenceScore = 92,
            MotorLocation = "Front Engine Bay",
            BatteryLocation = "Underbody Center",
            ElectronicsLocation = "Rear Cargo Compartment",
            ThermalSystemLocation = "Front Radiator Location"
        }
    };

    private readonly List<Battery> _batteries = new()
    {
        new Battery { Id = 1, Name = "95 kWh NMC", CapacityKWh = 95, WeightLbs = 1096, Cost = 10450 },
        new Battery { Id = 2, Name = "75 kWh NMC", CapacityKWh = 75, WeightLbs = 875, Cost = 8200 },
        new Battery { Id = 3, Name = "120 kWh NMC", CapacityKWh = 120, WeightLbs = 1450, Cost = 13500 }
    };

    private readonly List<Motor> _motors = new()
    {
        new Motor
        {
            Id = 1,
            Name = "HyperDrive 250",
            Manufacturer = "Phoenix EV",
            EfficiencyPct = 95.5m,
            WeightLbs = 220,
            CoolingType = "Liquid",
            PowerKW = 250,
            TorqueNm = 450,
            Cost = 5200
        }
    };

    public Task<List<VehicleDto>> GetVehiclesAsync(string? search = null, string? vehicleType = null, int page = 1, int pageSize = 20)
    {
        var pageNumber = Math.Max(1, page);
        var size = Math.Clamp(pageSize, 1, 100);

        IEnumerable<Vehicle> results = _vehicles;
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            results = results.Where(v =>
                v.Make.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                v.Model.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                v.Year.ToString().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(vehicleType))
        {
            results = results.Where(v => string.Equals(v.VehicleType, vehicleType, StringComparison.OrdinalIgnoreCase));
        }

        var pagedVehicles = results
            .OrderBy(v => v.Make)
            .ThenBy(v => v.Model)
            .Skip((pageNumber - 1) * size)
            .Take(size)
            .Select(MapToDto)
            .ToList();

        return Task.FromResult(pagedVehicles);
    }

    public Task<VehicleDto?> GetVehicleByIdAsync(int id)
    {
        var vehicle = _vehicles.FirstOrDefault(v => v.Id == id);
        return Task.FromResult(vehicle is null ? null : MapToDto(vehicle));
    }

    public Task<List<Battery>> GetBatteriesAsync() => Task.FromResult(_batteries.ToList());
    public Task<List<Motor>> GetMotorsAsync() => Task.FromResult(_motors.ToList());

    private static VehicleDto MapToDto(Vehicle vehicle) => new()
    {
        Id = vehicle.Id,
        Make = vehicle.Make,
        Model = vehicle.Model,
        Trim = vehicle.Trim ?? string.Empty,
        Year = vehicle.Year,
        VehicleType = vehicle.VehicleType ?? string.Empty,
        CurbWeightLbs = vehicle.CurbWeightLbs ?? 0,
        SeatingCapacity = vehicle.SeatingCapacity ?? 0,
        ImageUrl = "/images/qx60.jpg"
    };
}
