using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoemeCampos.Services;

namespace NoemeCampos.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Diretor,Coordenador,Financeiro")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _service;

    public DashboardController(DashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetMetricsAsync();
        return Ok(result);
    }
}