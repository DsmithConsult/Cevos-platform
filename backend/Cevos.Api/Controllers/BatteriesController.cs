using Cevos.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace Cevos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BatteriesController : ControllerBase
{
    private readonly CatalogDataStore _store;

    public BatteriesController(CatalogDataStore store)
    {
        _store = store;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _store.GetBatteriesAsync());
    }
}
