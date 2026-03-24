using Microsoft.EntityFrameworkCore;
using NoemeCampos.DTOs;
using NoemeCampos.Helpers;
using NoemeCampos.Models;
using NoemeCampos.Repositories;
using NoemeCampos.Exceptions;

namespace NoemeCampos.Services;

public class ProfessorService
{
    private readonly IRepository<Professor> _repository;

    public ProfessorService(IRepository<Professor> repository)
    {
        _repository = repository;
    }

    public async Task<PaginatedResult<ProfessorResponseDto>> GetAllAsync(QueryParameters parameters)
    {
        parameters.Page = parameters.Page <= 0 ? 1 : parameters.Page;
        parameters.PageSize = parameters.PageSize <= 0 ? 10 : parameters.PageSize;

        IQueryable<Professor> query = _repository.Query()
            .Include(p => p.Turmas)
            .ThenInclude(pt => pt.Turma);

        if (!string.IsNullOrWhiteSpace(parameters.Nome))
            query = query.Where(p => p.Nome.Contains(parameters.Nome));

        var totalItems = await query.CountAsync();

        var data = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .Select(p => new ProfessorResponseDto
            {
                Id = p.Id,
                Nome = p.Nome,
                CPF = p.CPF,
                Especialidade = p.Especialidade,
                Salario = p.Salario,
                Turmas = p.Turmas
                    .Select(pt => pt.Turma.Nome)
                    .ToList()
            })
            .ToListAsync();

        return new PaginatedResult<ProfessorResponseDto>(
            data,
            totalItems,
            parameters.Page,
            parameters.PageSize
        );
    }

    public async Task<ProfessorResponseDto> GetByIdAsync(int id)
    {
        var professor = await _repository.Query()
            .Include(p => p.Turmas)
            .ThenInclude(pt => pt.Turma)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (professor == null)
            throw new BusinessException("Professor não encontrado");

        return new ProfessorResponseDto
        {
            Id = professor.Id,
            Nome = professor.Nome,
            CPF = professor.CPF,
            Especialidade = professor.Especialidade,
            Salario = professor.Salario,
            Turmas = professor.Turmas
                .Select(pt => pt.Turma.Nome)
                .ToList()
        };
    }

    public async Task<ProfessorResponseDto> CreateAsync(ProfessorCreateDto dto)
    {
        var professor = new Professor
        {
            Nome = dto.Nome,
            CPF = dto.CPF,
            Especialidade = dto.Especialidade,
            Salario = dto.Salario
        };

        await _repository.AddAsync(professor);
        await _repository.SaveAsync();

        return new ProfessorResponseDto
        {
            Id = professor.Id,
            Nome = professor.Nome,
            CPF = professor.CPF,
            Especialidade = professor.Especialidade,
            Salario = professor.Salario,
            Turmas = new List<string>()
        };
    }

    public async Task UpdateAsync(int id, ProfessorCreateDto dto)
    {
        var professor = await _repository.GetByIdAsync(id);

        if (professor == null)
            throw new BusinessException("Professor não encontrado");

        professor.Nome = dto.Nome;
        professor.CPF = dto.CPF;
        professor.Especialidade = dto.Especialidade;
        professor.Salario = dto.Salario;

        _repository.Update(professor);
        await _repository.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var professor = await _repository.GetByIdAsync(id);

        if (professor == null)
            throw new BusinessException("Professor não encontrado");

        _repository.Remove(professor);
        await _repository.SaveAsync();
    }
}
