using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

[Index(nameof(CPF), IsUnique = true)]
[Index(nameof(Matricula), IsUnique = true)]
public class Aluno
{
    public int Id { get; set; }

    [Required, MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{11}$")]
    public string CPF { get; set; } = string.Empty;

    [Required]
    public string Matricula { get; set; } = string.Empty;

    public DateTime DataNascimento { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public string? Telefone { get; set; }

    public int? EnderecoId { get; set; }
    public Endereco? Endereco { get; set; }

    public DateTime DataMatricula { get; set; }

    public bool Ativo { get; set; } = true;

    public int TurmaId { get; set; }
    public Turma Turma { get; set; } = null!;

    public ICollection<AlunoResponsavel> Responsaveis { get; set; } = new List<AlunoResponsavel>();
}