using Microsoft.EntityFrameworkCore;
using NoemeCampos.Data;
using NoemeCampos.DTOs;

namespace NoemeCampos.Services;

public class DashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponseDto> GetMetricsAsync()
    {
        return new DashboardResponseDto
        {
            TotalAlunos = await _context.Alunos.CountAsync(),
            TotalTurmas = await _context.Turmas.CountAsync(),
            TotalProfessores = await _context.Professores.CountAsync()
        };
    }
}