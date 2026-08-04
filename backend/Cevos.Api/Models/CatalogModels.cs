namespace Cevos.Api.Models;

public class Vehicle
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string? Trim { get; set; }
    public int Year { get; set; }
    public string? VehicleType { get; set; }
    public string? BodyStyle { get; set; }
    public string? DriveType { get; set; }
    public decimal? WheelbaseIn { get; set; }
    public decimal? LengthIn { get; set; }
    public decimal? WidthIn { get; set; }
    public decimal? HeightIn { get; set; }
    public int? CurbWeightLbs { get; set; }
    public int? GVWRLbs { get; set; }
    public int? SeatingCapacity { get; set; }
    public int? DoorCount { get; set; }
    public decimal? CargoVolumeFt3 { get; set; }
    public int? Horsepower { get; set; }
    public int? TorqueLbFt { get; set; }
    public decimal? FuelTankGallons { get; set; }
    public int? RecommendedBatteryKWh { get; set; }
    public int? RecommendedMotorKW { get; set; }
    public int? EstimatedRangeMiles { get; set; }
    public int? ConfidenceScore { get; set; }
    public string? MotorLocation { get; set; }
    public string? BatteryLocation { get; set; }
    public string? ElectronicsLocation { get; set; }
    public string? ThermalSystemLocation { get; set; }
    public VehicleThermalSummary ThermalSummary { get; set; } = new();
    public string DisplayName => $"{Make} {Model} {Year}";
}

public class VehicleThermalSummary
{
    public int ThermalPerformancePct { get; set; } = 92;
    public int MotorCoolingPct { get; set; } = 98;
    public int BatteryCoolingPct { get; set; } = 85;
    public decimal AmbientTempF { get; set; } = 95;
    public decimal MotorPowerKw { get; set; } = 225;
    public decimal HeatGeneratedKw { get; set; } = 10.2m;
    public decimal CoolantTempC { get; set; } = 74;
    public decimal MotorTempC { get; set; } = 78;
    public decimal DeratingThresholdC { get; set; } = 80;
    public decimal ThermalMarginC { get; set; } = 2;
}

public class Battery
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal CapacityKWh { get; set; }
    public int WeightLbs { get; set; }
    public decimal Cost { get; set; }
}

public class Motor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int PowerKW { get; set; }
    public int TorqueNm { get; set; }
    public decimal Cost { get; set; }
    public string Manufacturer { get; set; } = string.Empty;
    public decimal EfficiencyPct { get; set; }
    public int WeightLbs { get; set; }
    public string? CoolingType { get; set; }
}

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int VehicleId { get; set; }
    public int BatteryId { get; set; }
    public int MotorId { get; set; }
}
