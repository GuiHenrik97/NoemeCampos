using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

public class ProfessorInfo
{
    [Key]
    public int FuncionarioId { get; set; }

    public Funcionario Funcionario { get; set; } = null!;

    [Required]
    public string RegistroDocente { get; set; } = string.Empty;

    [Required]
    public string Especialidade { get; set; } = string.Empty;

    public int CargaHoraria { get; set; }
}