using Microsoft.EntityFrameworkCore;
using NoemeCampos.Models;

namespace NoemeCampos.Data;

public static class DbInitializer
{
    private const string AdminEmail = "admin@noemecampos.com";
    private const string AdminPassword = "Admin123";
    private const string AdminRole = "Admin";

    public static async Task SeedAdminAsync(AppDbContext context)
    {
        var admin = await context.Users
            .FirstOrDefaultAsync(u => u.Email == AdminEmail);

        if (admin == null)
        {
            admin = new User
            {
                Email = AdminEmail
            };

            context.Users.Add(admin);
        }

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(AdminPassword);
        admin.Role = AdminRole;

        await context.SaveChangesAsync();
    }
}
