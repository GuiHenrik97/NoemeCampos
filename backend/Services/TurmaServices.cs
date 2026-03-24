using Microsoft.EntityFrameworkCore;
using NoemeCampos.DTOs;
using NoemeCampos.Helpers;
using NoemeCampos.Models;
using NoemeCampos.Repositories;
using NoemeCampos.Exceptions;

namespace NoemeCampos.Services;

public class TurmaService
{
    private readonly IRepository<Turma> _repository;

    public TurmaService(IRepository<Turma> repository)
    {
        _repository = repository;
    }

    public async Task<PaginatedResult<TurmaResponseDto>> GetAllAsync(QueryParameters parameters)
    {
        var query = _repository
            .Query()
            .Include(t => t.Alunos)
            .Include(t => t.Funcionarios)
                .ThenInclude(ft => ft.Funcionario);

        var totalItems = await query.CountAsync();

        var data = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .Select(t => new TurmaResponseDto
            {
                Id = t.Id,
                Nome = t.Nome,
                AnoLetivo = t.AnoLetivo,
                Sala = t.Sala,
                QuantidadeAlunos = t.Alunos.Count,
                Professores = t.Funcionarios
                    .Where(ft => ft.Funcionario.TipoFuncionario == "Professor")
                    .Select(ft => ft.Funcionario.Nome)
                    .ToList()
            })
            .ToListAsync();

        return new PaginatedResult<TurmaResponseDto>(
            data,
            totalItems,
            parameters.Page,
            parameters.PageSize
        );
    }

    public async Task<TurmaResponseDto> GetByIdAsync(int id)
    {
        var turma = await _repository
            .Query()
            .Include(t => t.Alunos)
            .Include(t => t.Funcionarios)
                .ThenInclude(ft => ft.Funcionario)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (turma == null)
            throw new BusinessException("Turma não encontrada");

        return new TurmaResponseDto
        {
            Id = turma.Id,
            Nome = turma.Nome,
            AnoLetivo = turma.AnoLetivo,
            Sala = turma.Sala,
            QuantidadeAlunos = turma.Alunos.Count,
            Professores = turma.Funcionarios
                .Where(ft => ft.Funcionario.TipoFuncionario == "Professor")
                .Select(ft => ft.Funcionario.Nome)
                .ToList()
        };
    }

    public async Task<TurmaResponseDto> CreateAsync(TurmaCreateDto dto)
    {
        var turma = new Turma
        {
            Nome = dto.Nome,
            AnoLetivo = dto.AnoLetivo,
            Sala = dto.Sala
        };

        await _repository.AddAsync(turma);
        await _repository.SaveAsync();

        return new TurmaResponseDto
        {
            Id = turma.Id,
            Nome = turma.Nome,
            AnoLetivo = turma.AnoLetivo,
            Sala = turma.Sala,
            QuantidadeAlunos = 0,
            Professores = new List<string>()
        };
    }

    public async Task UpdateAsync(int id, TurmaUpdateDto dto)
    {
        var turma = await _repository.GetByIdAsync(id);

        if (turma == null)
            throw new BusinessException("Turma não encontrada");

        turma.Nome = dto.Nome;
        turma.AnoLetivo = dto.AnoLetivo;
        turma.Sala = dto.Sala;

        _repository.Update(turma);
        await _repository.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var turma = await _repository.GetByIdAsync(id);

        if (turma == null)
            throw new BusinessException("Turma não encontrada");

        _repository.Remove(turma);
        await _repository.SaveAsync();
    }
}