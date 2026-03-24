using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

public class Turma
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    public int AnoLetivo { get; set; }

    [Required, MaxLength(20)]
    public string Sala { get; set; } = string.Empty;

    public string? Periodo { get; set; }

    public int CapacidadeMaxima { get; set; }

    public bool Ativa { get; set; } = true;

    public ICollection<Aluno> Alunos { get; set; } = new List<Aluno>();

    public ICollection<FuncionarioTurma> Funcionarios { get; set; } = new List<FuncionarioTurma>();
}