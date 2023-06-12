using Microsoft.Graph;

namespace ReactBffProxy.Services;

public class MsGraphService
{
    private readonly GraphServiceClient _graphServiceClient;

    public MsGraphService(GraphServiceClient graphServiceClient)
    {
        _graphServiceClient = graphServiceClient;
    }

    public async Task<User> GetGraphApiUser()
    {
        return await _graphServiceClient
            .Me
            .Request()
            .WithScopes(new[] { "User.ReadBasic.All", "user.read" })
            .GetAsync();
    }

    public async Task<string> GetGraphApiProfilePhoto()
    {
        try
        {
            var photo = string.Empty;
            // Get user photo
            using (var photoStream = await _graphServiceClient
                       .Me.Photo.Content.Request()
                       .WithScopes(new[] { "User.ReadBasic.All", "user.read" }).GetAsync())
            {
                var photoByte = ((MemoryStream)photoStream).ToArray();
                photo = Convert.ToBase64String(photoByte);
            }

            return photo;
        }
        catch
        {
            return string.Empty;
        }
    }
}
