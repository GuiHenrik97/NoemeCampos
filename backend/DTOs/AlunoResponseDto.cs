public class AlunoResponseDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string CPF { get; set; } = string.Empty;
    public string Matricula { get; set; } = string.Empty;
    public DateTime DataNascimento { get; set; }
    public string? Email { get; set; }
    public string? Telefone { get; set; }
    
    public string? Endereco { get; set; }
    public bool Ativo { get; set; }

    public int TurmaId { get; set; }
    public string TurmaNome { get; set; } = string.Empty;
}