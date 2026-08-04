using Cevos.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Cevos.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(new List<Project>());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        return id == 1
            ? Ok(new Project { Id = 1, Name = "Infiniti QX60 EV Conversion", VehicleId = 1, BatteryId = 1, MotorId = 1 })
            : NotFound();
    }

    [HttpPost]
    public IActionResult Create([FromBody] Project project)
    {
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }
}
