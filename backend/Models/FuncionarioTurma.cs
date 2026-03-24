namespace NoemeCampos.Models;

public class FuncionarioTurma
{
    public int FuncionarioId { get; set; }
    public Funcionario Funcionario { get; set; } = null!;

    public int TurmaId { get; set; }
    public Turma Turma { get; set; } = null!;
}