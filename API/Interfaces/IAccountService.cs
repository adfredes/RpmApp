using System.Threading.Tasks;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Interfaces
{
    public interface IAccountService
    {
        Task<UserDto> Register(RegisterDto registerDto);
        Task<UserDto> Login(LoginDto loginDto);
        Task<bool> ChangePassword(string username, PasswordDto passwordDto);
        Task<string> GenerateResetPasswordToken(string username);
        Task<UserDto> ResetPassword(string username, PasswordDto passwordDto);
        Task<bool> IsUserExists(string username);
        Task<bool> IsEmailExists(string email);
        Task<bool> IsDocumentExists(string documentNumber, int documentTypeId);
        Task<string> GetUserEmail(string username);
    }
}