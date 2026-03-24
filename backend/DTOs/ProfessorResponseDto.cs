namespace NoemeCampos.DTOs;

public class ProfessorResponseDto
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string CPF { get; set; } = string.Empty;

    public string Especialidade { get; set; } = string.Empty;

    public decimal Salario { get; set; }
    
    public List<string> Turmas { get; set; } = new();
}