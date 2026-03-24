using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NoemeCampos.DTOs;
using NoemeCampos.Services;
using NoemeCampos.Helpers;

namespace NoemeCampos.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // TODOS autenticados podem visualizar
public class AlunoController : ControllerBase
{
    private readonly AlunoService _service;

    public AlunoController(AlunoService service)
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

    // 🔒 Apenas Admin, Diretor e Financeiro podem criar
    [Authorize(Roles = "Admin,Diretor,Financeiro")]
    [HttpPost]
    public async Task<IActionResult> Create(AlunoCreateDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    // 🔒 Apenas Admin, Diretor e Financeiro podem editar
    [Authorize(Roles = "Admin,Diretor,Financeiro")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AlunoUpdateDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return NoContent();
    }

    // 🔒 Apenas Admin, Diretor e Financeiro podem excluir
    [Authorize(Roles = "Admin,Diretor,Financeiro")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}