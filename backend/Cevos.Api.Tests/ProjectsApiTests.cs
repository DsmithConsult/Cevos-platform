using System.Net;
using System.Net.Http.Json;
using Cevos.Api.Data;
using Cevos.Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace Cevos.Api.Tests;

public class ProjectsApiTests
{
    [Fact]
    public async Task ProjectCrudEndpointsPersistProjects()
    {
        using var factory = new TestApiFactory();
        using var client = factory.CreateClient();

        var createResponse = await client.PostAsJsonAsync("/api/projects", CreateRequest());
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var created = await createResponse.Content.ReadFromJsonAsync<ProjectDetailDto>();
        Assert.NotNull(created);
        Assert.True(created.Id > 0);

        var getResponse = await client.GetAsync($"/api/projects/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var retrieved = await getResponse.Content.ReadFromJsonAsync<ProjectDetailDto>();
        Assert.Equal(created.Name, retrieved?.Name);

        var list = await client.GetFromJsonAsync<ProjectSummaryDto[]>("/api/projects");
        Assert.NotNull(list);
        Assert.Single(list);

        var updateResponse = await client.PutAsJsonAsync($"/api/projects/{created.Id}", CreateRequest("Updated build"));
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        var updated = await updateResponse.Content.ReadFromJsonAsync<ProjectDetailDto>();
        Assert.Equal("Updated build", updated?.Name);
        Assert.Equal(created.CreatedAt, updated?.CreatedAt);

        var deleteResponse = await client.DeleteAsync($"/api/projects/{created.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/projects/{created.Id}")).StatusCode);
    }

    [Fact]
    public async Task CreateRejectsInvalidProjectPayload()
    {
        using var factory = new TestApiFactory();
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/projects", CreateRequest(name: ""));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetUnknownProjectReturnsNotFound()
    {
        using var factory = new TestApiFactory();
        using var client = factory.CreateClient();

        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/projects/999")).StatusCode);
    }

    private static ProjectUpsertRequest CreateRequest(string name = "QX60 conversion") => new()
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

    private sealed class TestApiFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.RemoveAll<IProjectRepository>();
                services.AddSingleton<IProjectRepository, InMemoryProjectRepository>();
            });
        }
    }
}