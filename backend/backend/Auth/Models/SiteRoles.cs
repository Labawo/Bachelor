namespace backend.Auth.Models;

public class SiteRoles
{
    public const string Admin = nameof(Admin);
    public const string Student = nameof(Student);

    public static readonly IReadOnlyCollection<string> All = new[] { Admin, Student };
}