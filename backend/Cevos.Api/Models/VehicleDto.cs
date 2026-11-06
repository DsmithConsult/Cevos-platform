namespace Cevos.Api.Models;

public class VehicleDto
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Trim { get; set; } = string.Empty;
    public int Year { get; set; }
    public string VehicleType { get; set; } = string.Empty;
    public string BodyStyle { get; set; } = string.Empty;
    public string DriveType { get; set; } = string.Empty;
    public decimal WheelbaseIn { get; set; }
    public decimal LengthIn { get; set; }
    public decimal WidthIn { get; set; }
    public decimal HeightIn { get; set; }
    public int CurbWeightLbs { get; set; }
    public int GVWRLbs { get; set; }
    public int SeatingCapacity { get; set; }
    public int DoorCount { get; set; }
    public decimal CargoVolumeFt3 { get; set; }
    public int RecommendedBatteryKWh { get; set; }
    public int RecommendedMotorKW { get; set; }
    public int EstimatedRangeMiles { get; set; }
    public int ConfidenceScore { get; set; }
    public string BatteryLocation { get; set; } = string.Empty;
    public string MotorLocation { get; set; } = string.Empty;
    public string ElectronicsLocation { get; set; } = string.Empty;
    public string ThermalSystemLocation { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
