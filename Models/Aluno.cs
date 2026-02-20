using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

[Index(nameof(CPF), IsUnique = true)]
public class Aluno
{
    public int Id { get; set; }

    [Required]
    [MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{11}$", ErrorMessage = "CPF deve conter exatamente 11 dígitos numéricos.")]
    public string CPF { get; set; } = string.Empty;
}