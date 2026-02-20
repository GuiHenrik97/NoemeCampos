using Microsoft.EntityFrameworkCore;
using NoemeCampos.Middleware;
using NoemeCampos.Data;
using NoemeCampos.Services;

var builder = WebApplication.CreateBuilder(args);

// Adiciona suporte a Controllers
builder.Services.AddControllers();

// 👇 ADICIONE AQUI (antes do Build)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=noemecampos.db"));

// Ativa Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<AlunoService>();
builder.Services.AddScoped<ProfessorService>();

var app = builder.Build();

// Ativa Swagger apenas em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.UseAuthorization();

// Mapeia Controllers
app.MapControllers();

// Inicia aplicação
app.Run();