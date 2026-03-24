using System.ComponentModel.DataAnnotations;

namespace NoemeCampos.DTOs
{
    public class TurmaUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public int AnoLetivo { get; set; }

        [Required]
        [MaxLength(20)]
        public string Sala { get; set; } = string.Empty;
    }
}