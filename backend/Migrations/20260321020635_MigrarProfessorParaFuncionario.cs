using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NoemeCampos.Migrations
{
    /// <inheritdoc />
    public partial class MigrarProfessorParaFuncionario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Migrar dados de Professor para Funcionario
            migrationBuilder.Sql(@"
                INSERT INTO Funcionarios (Nome, CPF, Email, Telefone, DataAdmissao, Cargo, SalarioBase, TipoFuncionario, Ativo)
                SELECT
                    p.Nome,
                    p.CPF,
                    p.CPF || '@noemecampos.edu.br' as Email,
                    '' as Telefone,
                    datetime('now') as DataAdmissao,
                    'Professor' as Cargo,
                    p.Salario as SalarioBase,
                    'Professor' as TipoFuncionario,
                    1 as Ativo
                FROM Professores p
                WHERE NOT EXISTS (
                    SELECT 1 FROM Funcionarios f
                    WHERE f.CPF = p.CPF AND f.TipoFuncionario = 'Professor'
                )
            ");

            // Criar registros em ProfessorInfo para os professores migrados
            migrationBuilder.Sql(@"
                INSERT INTO ProfessorInfo (FuncionarioId, RegistroDocente, Especialidade, CargaHoraria)
                SELECT
                    f.Id,
                    'REG-' || f.CPF as RegistroDocente,
                    p.Especialidade,
                    40 as CargaHoraria
                FROM Funcionarios f
                INNER JOIN Professores p ON f.CPF = p.CPF
                WHERE f.TipoFuncionario = 'Professor'
                AND NOT EXISTS (
                    SELECT 1 FROM ProfessorInfo pi WHERE pi.FuncionarioId = f.Id
                )
            ");

            // Migrar relacionamentos ProfessorTurma para FuncionarioTurma
            migrationBuilder.Sql(@"
                INSERT INTO FuncionarioTurma (FuncionarioId, TurmaId)
                SELECT
                    f.Id as FuncionarioId,
                    pt.TurmaId
                FROM ProfessorTurma pt
                INNER JOIN Professores p ON pt.ProfessorId = p.Id
                INNER JOIN Funcionarios f ON f.CPF = p.CPF AND f.TipoFuncionario = 'Professor'
                WHERE NOT EXISTS (
                    SELECT 1 FROM FuncionarioTurma ft
                    WHERE ft.FuncionarioId = f.Id AND ft.TurmaId = pt.TurmaId
                )
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverter migração: deletar funcionarios que foram criados pela migração
            // ATENÇÃO: Isso só funciona se os dados não foram modificados após a migração
            migrationBuilder.Sql(@"
                DELETE FROM FuncionarioTurma
                WHERE FuncionarioId IN (
                    SELECT f.Id FROM Funcionarios f
                    INNER JOIN Professores p ON f.CPF = p.CPF
                    WHERE f.TipoFuncionario = 'Professor'
                    AND f.Email LIKE '%@noemecampos.edu.br'
                )
            ");

            migrationBuilder.Sql(@"
                DELETE FROM ProfessorInfo
                WHERE FuncionarioId IN (
                    SELECT f.Id FROM Funcionarios f
                    INNER JOIN Professores p ON f.CPF = p.CPF
                    WHERE f.TipoFuncionario = 'Professor'
                    AND f.Email LIKE '%@noemecampos.edu.br'
                )
            ");

            migrationBuilder.Sql(@"
                DELETE FROM Funcionarios
                WHERE TipoFuncionario = 'Professor'
                AND Email LIKE '%@noemecampos.edu.br'
                AND EXISTS (
                    SELECT 1 FROM Professores p WHERE p.CPF = Funcionarios.CPF
                )
            ");
        }
    }
}
