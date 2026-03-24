using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

[Index(nameof(CPF), IsUnique = true)]
public class Professor
{
    public int Id { get; set; }

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

    // 👇 ESSA PROPRIEDADE É OBRIGATÓRIA
    public List<ProfessorTurma> Turmas { get; set; } = new();
}