using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
//using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using System.Text;
using System.Web;

namespace API.Controllers
{
    public class AccountController: BaseController
    {
        private readonly ITokenService tokenService;
        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IMailService mailService;

        public AccountController(ITokenService tokenService,
                                IMapper mapper,
                                UserManager<AppUser> userManager,
                                SignInManager<AppUser> signInManager,
                                IMailService mailService){
            this.tokenService = tokenService;
            this.mapper = mapper;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.mailService = mailService;
        }

       [HttpGet("isemailexists/{documentTypeId}/{documentNumber}")]
        public async Task<ActionResult<bool>> IsDocumentExists(string documentNumber, int documentTypeId)
        {
            return await userManager.Users.AnyAsync(x => x.DocumentNumber == documentNumber && x.DocumentTypeId == documentTypeId);
        }

        [HttpGet("isemailexists/{email}")]
        public async Task<ActionResult<bool>> IsEmailExists(string email)
        {
            return await userManager.FindByEmailAsync(email) != null;
        }

        [HttpGet("isuserexists/{username}")]
        public async Task<ActionResult<bool>> IsUserExists(string username)
        {            
            return await userManager.FindByNameAsync(username) != null;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            loginDto.Username = loginDto.Username.ToLower();
            var user = await userManager.Users
                                .Include(p => p.Photos)
                                .SingleOrDefaultAsync(u => u.UserName == loginDto.Username);
            if (user == null) return Unauthorized("Usuario o contraseña incorrecta");

            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return Unauthorized("Usuario o contraseña incorrecta");

            return await CreateUserDto(user);

        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (IsDocumentExists(registerDto.DocumentNumber, registerDto.DocumentTypeId).Result.Value) return BadRequest("El documento ya se encuentra registrado") ;

            if (IsEmailExists(registerDto.Email).Result.Value) return BadRequest("El email ya se encuentra registrado");

            if (IsUserExists(registerDto.Username).Result.Value) return BadRequest("EL usuario ya se encuentra registrado");

            var user = mapper.Map<AppUser>(registerDto);
            var result = await userManager.CreateAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);            
            
            var roleResult = await userManager.AddToRoleAsync(user, "Student");
            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return await CreateUserDto(user);

        }

        [Authorize]
        [HttpPut("password/change")]
        public async Task<ActionResult> ChangePassword(PasswordDto passwordDto)
        {
            var username = HttpContext.User.GetUsername();            
            var user = await userManager.Users.SingleOrDefaultAsync(x => x.UserName == username);
            if (user == null || !await userManager.CheckPasswordAsync(user, passwordDto.Password)) return BadRequest("Contraseña incorrecta.");
            var result = await userManager.ChangePasswordAsync(user, passwordDto.Password, passwordDto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);
            return NoContent();
        }


        [HttpGet("forgotpassword/{username}")]
        public async Task<ActionResult> ForgotPasswordToken(string username)
        {
            username = username.ToLower();
            var user = await userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if(user == null) NotFound("Usuario inexistente");            
            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            
            if(string.IsNullOrEmpty(token)) return BadRequest();
            token = HttpUtility.UrlEncode(token);
            
            var email = await GetUserEmail(username);
            var body = new StringBuilder();
            
            body.Append("<p>Para reestablecer la contraseña de la cuenta presione <a href='");
            body.Append("http://localhost:4200/account/reset/" + username + "?token=" + token);
            // body.Append(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/account/reset/" + username + "?token=" + token);
            body.Append("'>aquí</a><br><br>En caso de no poder acceder, copie y pegue el siguiente enlace en su navegador:<br>");
            body.Append("http://localhost:4200/account/reset/" + username + "?token=" + token);
            // body.Append(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/account/reset/" + username + "?token=" + token);
            //body.Append(user)
            if( await mailService.SendMail("adfredes@gmail.com","RPM - Reestablecer contraseña",body.ToString())) return NoContent();
            else return BadRequest("No fue posible enviar el mail para reestablecer la contraseña");            
        }

        [HttpPut("forgotpassword")]
        public async Task<ActionResult<UserDto>> ResetPassword([FromQuery]string username, [FromBody]PasswordDto passwordDto)
        {
            passwordDto.Token =HttpUtility.UrlDecode(passwordDto.Token).Replace(" ","+");
            username = username.ToLower();
            var user = await userManager.Users
                            .Include(p => p.Photos)
                            .SingleOrDefaultAsync(u => u.UserName == username);
            var result = await userManager.ResetPasswordAsync(user, passwordDto.Token, passwordDto.Password);
            if (!result.Succeeded) throw new Exception(result.Errors.ToString());
            return await CreateUserDto(user);            
        }

        private async Task<string> GetUserEmail(string username)
        {
            username = username.ToLower();
            return await userManager.Users
                                    .Where(u => u.UserName == username)
                                    .Select(u => u.Email)
                                    .SingleOrDefaultAsync();
            
        }

        private async Task<ActionResult<UserDto>> CreateUserDto(AppUser user)
        {
            return new UserDto
            {
                Username = user.UserName,
                Token = await tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Avatar = user.Photos != null ? user.Photos.FirstOrDefault(p => p.IsAvatar == true).url : ""
            };
        }        

        // [HttpPost("register")]
        // public async Task<ActionResult<UserDto>> Register (RegisterDto registerDto)
        // {
        //     try{
        //         return await accountService.Register(registerDto);
        //     }catch(ValidationException exv){
        //         return BadRequest(exv.Message);
        //     }catch(Exception ex){
        //         return BadRequest(ex.Message);
        //     }
            
        // }

        // [HttpPost("login")]
        // public async Task<ActionResult<UserDto>> Login (LoginDto loginDto)
        // {
        //     var userDto = await accountService.Login(loginDto);
        //     if(userDto == null) return Unauthorized("Usuario o contraseña incorrecto");
        //     return userDto;
        // }

        // [Authorize]
        // [HttpPut("password/change")]
        // public async Task<ActionResult> ChangePassword(PasswordDto passwordDto)
        // {
        //     var username = HttpContext.User.GetUsername();
            
        //         if(!await accountService.ChangePassword(username, passwordDto)) return BadRequest("Contraseña incorrecta.");
        //         return NoContent();                        
        // }

        // [HttpGet("forgotpassword/{username}")]
        // public async Task<ActionResult> ForgotPasswordToken(string username)
        // {
        //     var token = await accountService.GenerateResetPasswordToken(username);
        //     if(string.IsNullOrEmpty(token)) return NotFound();
        //     token = HttpUtility.UrlEncode(token);
        //     var email = await accountService.GetUserEmail(username);
        //     var body = new StringBuilder();
        //     body.Append("<p>Para reestablecer la contraseña de la cuenta presione <a href='");
        //     body.Append("http://localhost:4200/account/reset/" + username + "?token=" + token);
        //     // body.Append(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/account/reset/" + username + "?token=" + token);
        //     body.Append("'>aquí</a><br><br>En caso de no poder acceder, copie y pegue el siguiente enlace en su navegador:<br>");
        //     body.Append("http://localhost:4200/account/reset/" + username + "?token=" + token);
        //     // body.Append(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + "/account/reset/" + username + "?token=" + token);
        //     //body.Append(user)
        //     if( await mailService.SendMail("adfredes@gmail.com","RPM - Reestablecer contraseña",body.ToString())) return NoContent();
        //     else return BadRequest();            
        // }

        // [HttpPut("forgotpassword")]
        // public async Task<ActionResult<UserDto>> ForgotPassword([FromQuery]string username, [FromBody]PasswordDto passwordDto)
        // {
        //     passwordDto.Token =HttpUtility.UrlDecode(passwordDto.Token).Replace(" ","+");
        //     return await accountService.ResetPassword(username, passwordDto);
            
        // }

        // [HttpGet("isemailexists/{email}")]
        // public async Task<ActionResult<bool>> IsEmailExists(string email)
        // {
        //     return await accountService.IsEmailExists(email);
        // }

        // [HttpGet("isuserexists/{username}")]
        // public async Task<ActionResult<bool>> IsUserExists(string username)
        // {
        //     return await accountService.IsUserExists(username);
        // }
    }
}