using Microsoft.EntityFrameworkCore;
using NoemeCampos.Models;

namespace NoemeCampos.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Aluno> Alunos { get; set; }
    public DbSet<Turma> Turmas { get; set; }
    public DbSet<Professor> Professores { get; set; }
    public DbSet<Funcionario> Funcionarios { get; set; }
    public DbSet<ProfessorInfo> ProfessoresInfo { get; set; }
    public DbSet<ProfessorTurma> ProfessorTurmas { get; set; }
    public DbSet<FuncionarioTurma> FuncionarioTurmas { get; set; }
    public DbSet<Endereco> Enderecos { get; set; }
    public DbSet<Responsavel> Responsaveis { get; set; }
    public DbSet<AlunoResponsavel> AlunoResponsaveis { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FuncionarioTurma>()
            .HasKey(ft => new { ft.FuncionarioId, ft.TurmaId });

        modelBuilder.Entity<FuncionarioTurma>()
            .HasOne(ft => ft.Funcionario)
            .WithMany(f => f.Turmas)
            .HasForeignKey(ft => ft.FuncionarioId);

        modelBuilder.Entity<FuncionarioTurma>()
            .HasOne(ft => ft.Turma)
            .WithMany(t => t.Funcionarios)
            .HasForeignKey(ft => ft.TurmaId);

        modelBuilder.Entity<ProfessorTurma>()
            .ToTable("ProfessorTurma");

        modelBuilder.Entity<ProfessorTurma>()
            .HasKey(pt => new { pt.ProfessorId, pt.TurmaId });

        modelBuilder.Entity<ProfessorTurma>()
            .HasOne(pt => pt.Professor)
            .WithMany(p => p.Turmas)
            .HasForeignKey(pt => pt.ProfessorId);

        modelBuilder.Entity<ProfessorTurma>()
            .HasOne(pt => pt.Turma)
            .WithMany()
            .HasForeignKey(pt => pt.TurmaId);

        modelBuilder.Entity<AlunoResponsavel>()
            .HasKey(ar => new { ar.AlunoId, ar.ResponsavelId });

        modelBuilder.Entity<AlunoResponsavel>()
            .HasOne(ar => ar.Aluno)
            .WithMany(a => a.Responsaveis)
            .HasForeignKey(ar => ar.AlunoId);

        modelBuilder.Entity<AlunoResponsavel>()
            .HasOne(ar => ar.Responsavel)
            .WithMany(r => r.Alunos)
            .HasForeignKey(ar => ar.ResponsavelId);

        modelBuilder.Entity<ProfessorInfo>()
            .HasOne(p => p.Funcionario)
            .WithOne()
            .HasForeignKey<ProfessorInfo>(p => p.FuncionarioId);
    }
}
