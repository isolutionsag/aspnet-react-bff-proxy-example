namespace ReactBffProxy.Server;

public static class SecurityHeadersDefinitions
{
    public static HeaderPolicyCollection GetHeaderPolicyCollection(bool isDev, string? idpHost)
    {
        if (idpHost == null)
        {
            throw new ArgumentNullException(nameof(idpHost));
        }

        var policy = new HeaderPolicyCollection()
            .AddFrameOptionsDeny()
            .AddXssProtectionBlock()
            .AddContentTypeOptionsNoSniff()
            .AddReferrerPolicyStrictOriginWhenCrossOrigin()
            .AddCrossOriginOpenerPolicy(builder => builder.SameOrigin())
            .AddCrossOriginResourcePolicy(builder => builder.SameOrigin())
            .AddCrossOriginEmbedderPolicy(builder => builder.RequireCorp())
            .AddContentSecurityPolicy(builder =>
            {
                builder.AddObjectSrc().None();
                builder.AddBlockAllMixedContent();
                builder.AddImgSrc().Self().From("data:");
                builder.AddFormAction().Self().From(idpHost);
                builder.AddFontSrc().Self().From("data:");

                builder.AddStyleSrc()
                    .Self()
                    .WithNonce()
                    // fontSource Roboto font hashes
                    .WithHash256("J+3YsBcGEYMOe4DwBHZqef/THcqobccvabWv1wEouI4=")
                    .WithHash256("V4IwtdGfOsoBVQHnBa1KtH7U1F/8DOybajAQtg/hH8g=")
                    .WithHash256("iipbIaWgMvkHAGXdddZx06mBEt4gjdNhScyxvn+CddY=")
                    .WithHash256("H0tkQ73WFMgIdWr8nm0WpqKPpQ1geGIwKH7hfM+LUXo=")
                    // browserLink hashes
                    .WithHash256("47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=")
                    .WithHash256("tVFibyLEbUGj+pO/ZSi96c01jJCvzWilvI5Th+wLeGE=");
                    

                builder.AddBaseUri().Self();
                builder.AddFrameAncestors().None();

                // due to React
                builder.AddScriptSrc()
                    .Self()
                    .WithHash256("8ZgGo/nOlaDknQkDUYiedLuFRSGJwIz6LAzsOrNxhmU=") // TODO: only in development                        
                    .WithHash256("/AO8vAagk08SqUGxY96ci/dGyTDsuoetPOJYMn7sc+E="); // VitePWA
            })
            .RemoveServerHeader()
            .AddPermissionsPolicy(builder =>
            {
                builder.AddAccelerometer().None();
                builder.AddAutoplay().None();
                builder.AddCamera().None();
                builder.AddEncryptedMedia().None();
                builder.AddFullscreen().All();
                builder.AddGeolocation().None();
                builder.AddGyroscope().None();
                builder.AddMagnetometer().None();
                builder.AddMicrophone().None();
                builder.AddMidi().None();
                builder.AddPayment().None();
                builder.AddPictureInPicture().None();
                builder.AddSyncXHR().None();
                builder.AddUsb().None();
            });

        if (!isDev)
        {
            // maxage = one year in seconds
            policy.AddStrictTransportSecurityMaxAgeIncludeSubDomains(60 * 60 * 24 * 365);
        }

        return policy;
    }
}
