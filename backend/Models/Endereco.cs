using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.Models;

public class Endereco
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Rua { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Numero { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Complemento { get; set; }

    [Required, MaxLength(100)]
    public string Bairro { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Cidade { get; set; } = string.Empty;

    [Required, MaxLength(2)]
    public string Estado { get; set; } = string.Empty;

    [Required, MaxLength(8)]
    public string Cep { get; set; } = string.Empty;
}