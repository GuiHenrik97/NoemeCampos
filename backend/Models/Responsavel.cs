using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

[Index(nameof(CPF), IsUnique = true)]
public class Responsavel
{
    public int Id { get; set; }

    [Required]
    public string Nome { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{11}$")]
    public string CPF { get; set; } = string.Empty;

    [EmailAddress]
    public string? Email { get; set; }

    public string? Telefone { get; set; }

    public int? EnderecoId { get; set; }
    public Endereco? Endereco { get; set; }

    public ICollection<AlunoResponsavel> Alunos { get; set; } = new List<AlunoResponsavel>();
}