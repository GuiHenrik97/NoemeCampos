using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoemeCampos.DTOs;
using NoemeCampos.Services;
using NoemeCampos.Helpers;

namespace NoemeCampos.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TurmaController : ControllerBase
{
    private readonly TurmaService _service;

    public TurmaController(TurmaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryParameters parameters)
    {
        var result = await _service.GetAllAsync(parameters);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "Admin,Diretor,Financeiro")]
    [HttpPost]
    public async Task<IActionResult> Create(TurmaCreateDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = "Admin,Diretor,Financeiro")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TurmaUpdateDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    [Authorize(Roles = "Admin,Diretor,Financeiro")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}