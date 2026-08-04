namespace Cevos.Api.Models;

public class VehicleDto
{
    public int Id { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Trim { get; set; } = string.Empty;
    public int Year { get; set; }
    public string VehicleType { get; set; } = string.Empty;
    public int CurbWeightLbs { get; set; }
    public int SeatingCapacity { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
