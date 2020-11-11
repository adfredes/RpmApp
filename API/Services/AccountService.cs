using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Errors;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace API.Services
{
    public class AccountService : IAccountService
    {
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;

        public AccountService(ITokenService tokenService,
                              IMapper mapper,
                              UserManager<AppUser> userManager,
                              SignInManager<AppUser> signInManager)
        {
            this.tokenService = tokenService;
            this.mapper = mapper;
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        public async Task<bool> IsDocumentExists(string documentNumber, int documentTypeId)
        {
            return await userManager.Users.AnyAsync(x => x.DocumentNumber == documentNumber && x.DocumentTypeId == documentTypeId);
        }

        public async Task<bool> IsEmailExists(string email)
        {
            return await userManager.FindByEmailAsync(email) != null;
        }

        public async Task<bool> IsUserExists(string username)
        {
            username = username.ToLower();
            return await userManager.Users.AnyAsync(x => x.UserName == username);
        }

        public async Task<UserDto> Login(LoginDto loginDto)
        {
            loginDto.Username = loginDto.Username.ToLower();
            var user = await userManager.Users
                                .Include(p => p.Photos)
                                .SingleOrDefaultAsync(u => u.UserName == loginDto.Username);
            if (user == null) return null;

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return null;

            return await CreateUserDto(user);

        }

        public async Task<UserDto> Register(RegisterDto registerDto)
        {
            if (await IsDocumentExists(registerDto.DocumentNumber, registerDto.DocumentTypeId)) throw new ValidationException("El documento ya se encuentra registrado") ;

            if (await IsEmailExists(registerDto.Email)) throw new ValidationException("El email ya se encuentra registrado");

            if (await IsUserExists(registerDto.Username)) throw new ValidationException("Usuario existente");

            var user = mapper.Map<AppUser>(registerDto);
            var result = await userManager.CreateAsync(user);
            if (!result.Succeeded) throw new Exception(result.Errors.ToString());

            var roleResult = await userManager.AddToRoleAsync(user, "Student");
            if (!roleResult.Succeeded) throw new Exception(result.Errors.ToString());

            return await CreateUserDto(user);

        }

        public async Task<bool> ChangePassword(string username, PasswordDto passwordDto)
        {
            username = username.ToLower();            
            var user = await userManager.Users.SingleOrDefaultAsync(x => x.UserName == username);
            if (user == null || !await userManager.CheckPasswordAsync(user, passwordDto.Password)) return false;
            var result = await userManager.ChangePasswordAsync(user, passwordDto.Password, passwordDto.NewPassword);
            if (!result.Succeeded) throw new Exception(result.Errors.ToString());
            return true;
        }

        private async Task<UserDto> CreateUserDto(AppUser user)
        {
            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Avatar = user.Photos != null ? user.Photos.FirstOrDefault(p => p.IsAvatar == true).url : ""
            };
        }

        public async Task<string> GenerateResetPasswordToken(string username)
        {
            username = username.ToLower();
            var user = await userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if(user == null) return string.Empty;
            return await userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task<UserDto> ResetPassword(string username, PasswordDto passwordDto)
        {
            username = username.ToLower();
            var user = await userManager.Users
                            .Include(p => p.Photos)
                            .SingleOrDefaultAsync(u => u.UserName == username);
            var result = await userManager.ResetPasswordAsync(user, passwordDto.Token, passwordDto.Password);
            if (!result.Succeeded) throw new Exception(result.Errors.ToString());
            return await CreateUserDto(user);            
        }

        public async Task<string> GetUserEmail(string username)
        {
            username = username.ToLower();
            return await userManager.Users
                                    .Where(u => u.UserName == username)
                                    .Select(u => u.Email)
                                    .SingleOrDefaultAsync();
            
        }
    }
}