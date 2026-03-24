using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.DTOs;

public class ProfessorCreateDto
{
    [Required]
    [MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{11}$")]
    public string CPF { get; set; } = string.Empty;

    [Required]
    public string Especialidade { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Salario { get; set; }
}