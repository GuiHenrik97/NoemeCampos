using System.Collections.Generic;

namespace NoemeCampos.DTOs
{
    public class TurmaResponseDto
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public int AnoLetivo { get; set; }

        public string Sala { get; set; } = string.Empty;

        public int QuantidadeAlunos { get; set; }

        public List<string> Professores { get; set; } = new();
    }
}