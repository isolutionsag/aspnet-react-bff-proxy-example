namespace ReactBffProxy.Server;

public static class AppRole
{
    /// <summary>
    /// Drink readers can read all drinks available.
    /// </summary>
    public const string DrinkReader = "Drinks.Read";

    /// <summary>
    /// Drink writers can add/modify drinks.
    /// </summary>
    public const string DrinkWriters = "Drinks.Write";

    /// <summary>
    /// Admin role for demo purposes.
    /// </summary>
    public const string DrinkAdmins = "Admin";
}

/// <summary>
/// Wrapper class the contain all the authorization policies available in this application.
/// </summary>
public static class AuthorizationPolicies
{
    public const string AssignmentToDrinkReaderRoleRequired = "AssignmentToDrinkReaderRoleRequired";
    public const string AssignmentToDrinkWriterRoleRequired = "AssignmentToDrinkWriterRoleRequired";
    public const string AssignmentToDrinkAdminRoleRequired = "AssignmentToDrinkAdminRoleRequired";
}
