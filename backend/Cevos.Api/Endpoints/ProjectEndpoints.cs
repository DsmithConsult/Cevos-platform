using System.ComponentModel.DataAnnotations;
using Cevos.Api.Data;
using Cevos.Api.Models;

namespace Cevos.Api.Endpoints;

public static class ProjectEndpoints
{
    public static IEndpointRouteBuilder MapProjectEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/projects").WithTags("Projects");

        group.MapGet("", async (IProjectRepository repository, CancellationToken cancellationToken) =>
        {
            var projects = await repository.GetAllAsync(cancellationToken);
            return Results.Ok(projects.Select(ProjectSummaryDto.From));
        });

        group.MapGet("/{id:int}", async (int id, IProjectRepository repository, CancellationToken cancellationToken) =>
        {
            var project = await repository.GetByIdAsync(id, cancellationToken);
            return project is null
                ? Results.NotFound()
                : Results.Ok(ProjectDetailDto.From(project));
        });

        group.MapPost("", async (ProjectUpsertRequest request, IProjectRepository repository, CancellationToken cancellationToken) =>
        {
            var validationErrors = Validate(request);
            if (validationErrors.Count > 0)
            {
                return Results.ValidationProblem(validationErrors);
            }

            var project = await repository.CreateAsync(ToProject(request), cancellationToken);
            return Results.Created($"/api/projects/{project.Id}", ProjectDetailDto.From(project));
        });

        group.MapPut("/{id:int}", async (int id, ProjectUpsertRequest request, IProjectRepository repository, CancellationToken cancellationToken) =>
        {
            var validationErrors = Validate(request);
            if (validationErrors.Count > 0)
            {
                return Results.ValidationProblem(validationErrors);
            }

            var project = await repository.UpdateAsync(id, ToProject(request), cancellationToken);
            return project is null
                ? Results.NotFound()
                : Results.Ok(ProjectDetailDto.From(project));
        });

        group.MapDelete("/{id:int}", async (int id, IProjectRepository repository, CancellationToken cancellationToken) =>
        {
            var deleted = await repository.DeleteAsync(id, cancellationToken);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        return endpoints;
    }

    private static Project ToProject(ProjectUpsertRequest request) => new()
    {
        Name = request.Name.Trim(),
        Status = string.IsNullOrWhiteSpace(request.Status) ? "Draft" : request.Status.Trim(),
        VehicleId = request.VehicleId.Trim(),
        BatteryId = request.BatteryId.Trim(),
        MotorId = request.MotorId.Trim(),
        Range = request.Range,
        Cost = request.Cost,
        Battery = request.Battery?.Trim(),
        Motor = request.Motor?.Trim(),
        Power = request.Power,
        Torque = request.Torque,
        ReadinessScore = request.ReadinessScore
    };

    private static Dictionary<string, string[]> Validate(ProjectUpsertRequest request)
    {
        var validationResults = new List<ValidationResult>();
        var context = new ValidationContext(request);
        Validator.TryValidateObject(request, context, validationResults, validateAllProperties: true);

        return validationResults
            .SelectMany(result => result.MemberNames.DefaultIfEmpty(string.Empty), (result, member) => new
            {
                Member = member,
                Error = result.ErrorMessage ?? "The supplied value is invalid."
            })
            .GroupBy(item => item.Member)
            .ToDictionary(group => group.Key, group => group.Select(item => item.Error).ToArray());
    }
}