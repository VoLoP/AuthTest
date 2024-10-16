using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AuthTest.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtAuthManager _jwtAuthManager;

        public AuthController(IJwtAuthManager jwtAuthManager)
        {
            _jwtAuthManager = jwtAuthManager;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Validate user credentials (this is just a placeholder)
            if (request.Username == "test" && request.Password == "password")
            {
                var token = _jwtAuthManager.GenerateToken(request.Username, request.RememberMe);
                return Ok(new { Token = token });
            }
            return Unauthorized();
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshRequest request)
        {
            try
            {
                var newToken = _jwtAuthManager.Refresh(request.Token);
                return Ok(new { Token = newToken });
            }
            catch (SecurityTokenException)
            {
                return Unauthorized();
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout([FromBody] LogoutRequest request)
        {
            _jwtAuthManager.Revoke(request.Token);
            return Ok();
        }
    }

     public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }

    public class RefreshRequest
    {
        public string Token { get; set; }
    }

    public class LogoutRequest
    {
        public string Token { get; set; }
    }
}
