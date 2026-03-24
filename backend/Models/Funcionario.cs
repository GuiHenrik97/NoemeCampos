using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

[Index(nameof(CPF), IsUnique = true)]
public class Funcionario
{
    public int Id { get; set; }

    [Required, MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    [Required, RegularExpression(@"^\d{11}$")]
    public string CPF { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Telefone { get; set; } = string.Empty;

    public int? EnderecoId { get; set; }
    public Endereco? Endereco { get; set; }

    public DateTime DataAdmissao { get; set; }

    [Required]
    public string Cargo { get; set; } = string.Empty;

    public decimal SalarioBase { get; set; }

    [Required]
    public string TipoFuncionario { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    public ICollection<FuncionarioTurma> Turmas { get; set; } = new List<FuncionarioTurma>();
}