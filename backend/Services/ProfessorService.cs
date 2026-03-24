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
        var query = _repository.Query();

        var totalItems = await query.CountAsync();

        var data = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .Select(p => new ProfessorResponseDto
            {
                Id = p.Id,
                Nome = p.Nome
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
        var professor = await _repository.GetByIdAsync(id);

        if (professor == null)
            throw new BusinessException("Professor não encontrado");

        return new ProfessorResponseDto
        {
            Id = professor.Id,
            Nome = professor.Nome
        };
    }

    public async Task<ProfessorResponseDto> CreateAsync(ProfessorCreateDto dto)
    {
        var professor = new Professor
        {
            Nome = dto.Nome
        };

        await _repository.AddAsync(professor);
        await _repository.SaveAsync();

        return new ProfessorResponseDto
        {
            Id = professor.Id,
            Nome = professor.Nome
        };
    }

    public async Task UpdateAsync(int id, ProfessorCreateDto dto)
    {
        var professor = await _repository.GetByIdAsync(id);

        if (professor == null)
            throw new BusinessException("Professor não encontrado");

        professor.Nome = dto.Nome;

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