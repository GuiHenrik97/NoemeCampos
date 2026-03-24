using Microsoft.EntityFrameworkCore;
using NoemeCampos.DTOs;
using NoemeCampos.Exceptions;
using NoemeCampos.Helpers;
using NoemeCampos.Models;
using NoemeCampos.Repositories;

namespace NoemeCampos.Services;

public class AlunoService
{
    private readonly IRepository<Aluno> _alunoRepository;
    private readonly IRepository<Turma> _turmaRepository;

    public AlunoService(
        IRepository<Aluno> alunoRepository,
        IRepository<Turma> turmaRepository)
    {
        _alunoRepository = alunoRepository;
        _turmaRepository = turmaRepository;
    }

    public async Task<PaginatedResult<AlunoResponseDto>> GetAllAsync(QueryParameters parameters)
    {
        IQueryable<Aluno> query = _alunoRepository
            .Query()
            .Include(a => a.Turma)
            .Include(a => a.Endereco); // ✅ IMPORTANTE

        if (!string.IsNullOrWhiteSpace(parameters.Nome))
            query = query.Where(a => a.Nome.Contains(parameters.Nome));

        var totalItems = await query.CountAsync();

        var alunos = await query
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        var result = alunos.Select(a => new AlunoResponseDto
        {
            Id = a.Id,
            Nome = a.Nome,
            CPF = a.CPF,
            Matricula = a.Matricula,
            DataNascimento = a.DataNascimento,
            Email = a.Email,
            Telefone = a.Telefone,
            Ativo = a.Ativo,
            TurmaId = a.TurmaId,
            TurmaNome = a.Turma.Nome,

            // ✅ Endereço formatado corretamente
            Endereco = a.Endereco != null
                ? $"{a.Endereco.Rua}, {a.Endereco.Numero}" +
                  $"{(string.IsNullOrWhiteSpace(a.Endereco.Complemento) ? "" : $" - {a.Endereco.Complemento}")}, " +
                  $"{a.Endereco.Bairro}, {a.Endereco.Cidade}/{a.Endereco.Estado} - CEP: {a.Endereco.Cep}"
                : null
        }).ToList();

        return new PaginatedResult<AlunoResponseDto>(
            result,
            totalItems,
            parameters.Page,
            parameters.PageSize
        );
    }

    public async Task<AlunoResponseDto?> GetByIdAsync(int id)
    {
        var aluno = await _alunoRepository.Query()
            .Include(a => a.Turma)
            .Include(a => a.Endereco) 
            .FirstOrDefaultAsync(a => a.Id == id);

        if (aluno == null)
            return null;

        return new AlunoResponseDto
        {
            Id = aluno.Id,
            Nome = aluno.Nome,
            CPF = aluno.CPF,
            Matricula = aluno.Matricula,
            DataNascimento = aluno.DataNascimento,
            Email = aluno.Email,
            Telefone = aluno.Telefone,
            Ativo = aluno.Ativo,
            TurmaId = aluno.TurmaId,
            TurmaNome = aluno.Turma.Nome,

            Endereco = aluno.Endereco != null
                ? $"{aluno.Endereco.Rua}, {aluno.Endereco.Numero}" +
                  $"{(string.IsNullOrWhiteSpace(aluno.Endereco.Complemento) ? "" : $" - {aluno.Endereco.Complemento}")}, " +
                  $"{aluno.Endereco.Bairro}, {aluno.Endereco.Cidade}/{aluno.Endereco.Estado} - CEP: {aluno.Endereco.Cep}"
                : null
        };
    }

    public async Task<AlunoResponseDto> CreateAsync(AlunoCreateDto dto)
    {
        var turma = await _turmaRepository.GetByIdAsync(dto.TurmaId);

        if (turma == null)
            throw new BusinessException("Turma não encontrada.");

        var aluno = new Aluno
        {
            Nome = dto.Nome,
            CPF = dto.CPF,
            Matricula = dto.Matricula,
            DataNascimento = dto.DataNascimento,
            Email = dto.Email,
            Telefone = dto.Telefone,
            TurmaId = dto.TurmaId,
            DataMatricula = DateTime.UtcNow,
            Ativo = true
        };

        // Criar endereço se fornecido
        if (dto.Endereco != null)
        {
            aluno.Endereco = new Endereco
            {
                Rua = dto.Endereco.Rua,
                Numero = dto.Endereco.Numero,
                Complemento = dto.Endereco.Complemento,
                Bairro = dto.Endereco.Bairro,
                Cidade = dto.Endereco.Cidade,
                Estado = dto.Endereco.Estado,
                Cep = dto.Endereco.Cep
            };
        }

        await _alunoRepository.AddAsync(aluno);
        await _alunoRepository.SaveAsync();

        return new AlunoResponseDto
        {
            Id = aluno.Id,
            Nome = aluno.Nome,
            CPF = aluno.CPF,
            Matricula = aluno.Matricula,
            DataNascimento = aluno.DataNascimento,
            Email = aluno.Email,
            Telefone = aluno.Telefone,
            Ativo = aluno.Ativo,
            TurmaId = turma.Id,
            TurmaNome = turma.Nome
        };
    }

    public async Task UpdateAsync(int id, AlunoUpdateDto dto)
    {
        var aluno = await _alunoRepository.GetByIdAsync(id);

        if (aluno == null)
            throw new BusinessException("Aluno não encontrado.");

        var turma = await _turmaRepository.GetByIdAsync(dto.TurmaId);

        if (turma == null)
            throw new BusinessException("Turma não encontrada.");

        aluno.Nome = dto.Nome;
        aluno.Email = dto.Email;
        aluno.Telefone = dto.Telefone;
        aluno.Ativo = dto.Ativo;
        aluno.TurmaId = dto.TurmaId;

        _alunoRepository.Update(aluno);
        await _alunoRepository.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var aluno = await _alunoRepository.GetByIdAsync(id);

        if (aluno == null)
            throw new BusinessException("Aluno não encontrado.");

        _alunoRepository.Remove(aluno);
        await _alunoRepository.SaveAsync();
    }
}