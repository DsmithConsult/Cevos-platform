using Cevos.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace Cevos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly CatalogDataStore _store;

    public VehiclesController(CatalogDataStore store)
    {
        _store = store;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? search)
    {
        return Ok(await _store.GetVehiclesAsync(search));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var vehicle = await _store.GetVehicleByIdAsync(id);
        return vehicle is null ? NotFound() : Ok(vehicle);
    }
}
