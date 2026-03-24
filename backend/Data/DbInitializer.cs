using Microsoft.EntityFrameworkCore;
using NoemeCampos.Models;

namespace NoemeCampos.Data;

public static class DbInitializer
{
    public static async Task SeedAdminAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync(u => u.Role == "Admin"))
            return;

        var admin = new User
        {
            Email = "admin@noemecampos.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"),
            Role = "Admin"
        };

        context.Users.Add(admin);
        await context.SaveChangesAsync();
    }
}