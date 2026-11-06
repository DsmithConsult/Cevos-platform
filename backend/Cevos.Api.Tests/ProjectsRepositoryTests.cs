using Cevos.Api.Data;
using Cevos.Api.Models;
using Xunit;

namespace Cevos.Api.Tests;

public class ProjectsRepositoryTests
{
    private readonly InMemoryProjectRepository _repository = new();

    [Fact]
    public async Task CreateAssignsIdAndTimestamps()
    {
        var created = await _repository.CreateAsync(CreateProject());

        Assert.Equal(1, created.Id);
        Assert.NotEqual(default, created.CreatedAt);
        Assert.Equal(created.CreatedAt, created.UpdatedAt);
    }

    [Fact]
    public async Task GetAllAndGetByIdReturnStoredProjectCopies()
    {
        var created = await _repository.CreateAsync(CreateProject());
        var listed = await _repository.GetAllAsync();
        var retrieved = await _repository.GetByIdAsync(created.Id);

        Assert.Single(listed);
        Assert.Equal(created.Id, listed[0].Id);
        Assert.Equal(created.Name, retrieved?.Name);
    }

    [Fact]
    public async Task UpdatePreservesIdAndCreatedAt()
    {
        var created = await _repository.CreateAsync(CreateProject());
        var updated = await _repository.UpdateAsync(created.Id, CreateProject("Updated build"));

        Assert.NotNull(updated);
        Assert.Equal(created.Id, updated.Id);
        Assert.Equal(created.CreatedAt, updated.CreatedAt);
        Assert.Equal("Updated build", updated.Name);
        Assert.True(updated.UpdatedAt >= created.UpdatedAt);
    }

    [Fact]
    public async Task UpdateAndDeleteReturnNotFoundForUnknownProjects()
    {
        Assert.Null(await _repository.UpdateAsync(99, CreateProject()));
        Assert.False(await _repository.DeleteAsync(99));
    }

    [Fact]
    public async Task DeleteRemovesProject()
    {
        var created = await _repository.CreateAsync(CreateProject());

        Assert.True(await _repository.DeleteAsync(created.Id));
        Assert.Null(await _repository.GetByIdAsync(created.Id));
    }

    [Fact]
    public async Task ConcurrentCreatesAssignUniqueIds()
    {
        var creates = Enumerable.Range(0, 50)
            .Select(index => _repository.CreateAsync(CreateProject($"Build {index}")));

        var projects = await Task.WhenAll(creates);

        Assert.Equal(50, projects.Select(project => project.Id).Distinct().Count());
    }

    private static Project CreateProject(string name = "QX60 conversion") => new()
    {
        Name = name,
        Status = "Draft",
        VehicleId = "qx60",
        BatteryId = "95kwh",
        MotorId = "hyperdrive250",
        Range = 285,
        Cost = 16300m,
        Battery = "95 kWh NMC Pack",
        Motor = "Phoenix HyperDrive 250",
        Power = 250,
        Torque = 450,
        ReadinessScore = 85
    };
}