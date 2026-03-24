namespace NoemeCampos.Models;

public class ProfessorTurma
{
    public int ProfessorId { get; set; }
    public Professor Professor { get; set; } = null!;

    public int TurmaId { get; set; }
    public Turma Turma { get; set; } = null!;
}