using Microsoft.IdentityModel.Tokens;
using NoemeCampos.DTOs;
using NoemeCampos.Models;
using NoemeCampos.Repositories;
using NoemeCampos.Helpers;
using NoemeCampos.Exceptions;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NoemeCampos.Services;

public class AuthService
{
    private readonly IRepository<User> _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IRepository<User> userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        if (!IsValidRole(dto.Role))
            throw new BusinessException("Role inválida.");

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveAsync();
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = _userRepository.Query()
            .FirstOrDefault(u => u.Email == dto.Email);

        if (user == null)
            return null;

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return null;

        return GenerateJwtToken(user);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private bool IsValidRole(string role)
    {
        return role == Roles.Admin
            || role == Roles.Diretor
            || role == Roles.Coordenador
            || role == Roles.Financeiro;
    }
}