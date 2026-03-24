using System.ComponentModel.DataAnnotations;
using NoemeCampos.Helpers;

namespace NoemeCampos.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = Roles.Coordenador;
}