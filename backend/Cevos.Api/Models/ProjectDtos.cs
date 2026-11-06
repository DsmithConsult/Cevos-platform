using System.ComponentModel.DataAnnotations;

namespace Cevos.Api.Models;

public sealed class ProjectUpsertRequest
{
    [Required, StringLength(120, MinimumLength = 1)]
    public string Name { get; init; } = string.Empty;

    [StringLength(40)]
    public string Status { get; init; } = "Draft";

    [Required, StringLength(80)]
    public string VehicleId { get; init; } = string.Empty;

    [Required, StringLength(80)]
    public string BatteryId { get; init; } = string.Empty;

    [Required, StringLength(80)]
    public string MotorId { get; init; } = string.Empty;

    [Range(0, 2000)]
    public int? Range { get; init; }

    [Range(typeof(decimal), "0", "10000000")]
    public decimal? Cost { get; init; }

    [StringLength(120)]
    public string? Battery { get; init; }

    [StringLength(120)]
    public string? Motor { get; init; }

    [Range(0, 5000)]
    public int? Power { get; init; }

    [Range(0, 20000)]
    public int? Torque { get; init; }

    [Range(0, 100)]
    public int? ReadinessScore { get; init; }
}

public sealed record ProjectSummaryDto(
    int Id,
    string Name,
    string Status,
    string VehicleId,
    string BatteryId,
    string MotorId,
    int? Range,
    decimal? Cost,
    DateTimeOffset UpdatedAt)
{
    public static ProjectSummaryDto From(Project project) => new(
        project.Id,
        project.Name,
        project.Status,
        project.VehicleId,
        project.BatteryId,
        project.MotorId,
        project.Range,
        project.Cost,
        project.UpdatedAt);
}

public sealed record ProjectDetailDto(
    int Id,
    string Name,
    string Status,
    string VehicleId,
    string BatteryId,
    string MotorId,
    int? Range,
    decimal? Cost,
    string? Battery,
    string? Motor,
    int? Power,
    int? Torque,
    int? ReadinessScore,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt)
{
    public static ProjectDetailDto From(Project project) => new(
        project.Id,
        project.Name,
        project.Status,
        project.VehicleId,
        project.BatteryId,
        project.MotorId,
        project.Range,
        project.Cost,
        project.Battery,
        project.Motor,
        project.Power,
        project.Torque,
        project.ReadinessScore,
        project.CreatedAt,
        project.UpdatedAt);
}