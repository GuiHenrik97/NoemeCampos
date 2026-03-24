using System.ComponentModel.DataAnnotations;

public class AlunoUpdateDto
{
    [Required]
    [MinLength(3)]
    public string Nome { get; set; } = string.Empty;

    public string? Email { get; set; }
    public string? Telefone { get; set; }
    
    public string? Endereco { get; set; }

    [Required]
    public int TurmaId { get; set; }

    public bool Ativo { get; set; }
}