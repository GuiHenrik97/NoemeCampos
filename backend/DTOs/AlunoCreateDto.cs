using System.ComponentModel.DataAnnotations;
using NoemeCampos.DTOs;

public class AlunoCreateDto
{
    [Required]
    [MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{11}$")]
    public string CPF { get; set; } = string.Empty;

    [Required]
    public string Matricula { get; set; } = string.Empty;

    [Required]
    public DateTime DataNascimento { get; set; }

    public string? Email { get; set; }

    public string? Telefone { get; set; }

    public EnderecoDto? Endereco { get; set; }

    [Required]
    public int TurmaId { get; set; }
}