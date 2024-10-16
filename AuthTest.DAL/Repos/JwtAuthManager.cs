using System;
using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public interface IJwtAuthManager
{
    string GenerateToken(string username, bool rememberMe);
    string Refresh(string token);
    void Revoke(string token);
}

public class JwtAuthManager : IJwtAuthManager
{
    private readonly ConcurrentDictionary<string, string> _refreshTokens = new();
    private readonly string _secretKey = "wow";

    public string GenerateToken(string username, bool rememberMe)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, username) }),
            Expires = rememberMe ? DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        _refreshTokens[tokenString] = username;

        return tokenString;
    }

    public string Refresh(string token)
    {
        if (_refreshTokens.TryGetValue(token, out var username))
        {
            return GenerateToken(username, false);
        }
        throw new SecurityTokenException("Invalid token");
    }

    public void Revoke(string token)
    {
        _refreshTokens.TryRemove(token, out _);
    }
}