namespace backend.Auth.Models;

public interface IUserOwnedResource
{
    public string OwnerId { get; }
}