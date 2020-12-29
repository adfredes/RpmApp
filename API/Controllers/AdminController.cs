using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController: BaseController
    {        
        private readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;        
        private readonly RoleManager<AppRole> roleManager;
        

        public AdminController(IMapper mapper,
                                UserManager<AppUser> userManager,                                
                                RoleManager<AppRole> roleManager){
            
            this.mapper = mapper;
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        [HttpGet("roles")]
        public async Task<ActionResult<ICollection<ComboDto>>> GetRoles() {
            return mapper.Map<List<ComboDto>>(await roleManager.Roles.ToListAsync());
        }    

        [HttpGet("users")]   
        public async Task<ActionResult<ICollection<UserAccountDto>>> GetUsers() {
            var users = await userManager.Users
                            .Include(u => u.UserRoles)
                            .ThenInclude(r => r.Role)
                            .OrderBy(u => u.UserName)
                            .ToListAsync();
            return mapper.Map<List<UserAccountDto>>(users);
        }

        [HttpPut("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles){
            var selectedRoles = roles.Split(",").ToArray();
            var user = await userManager.FindByNameAsync(username);

            if(user == null) return NotFound("Usuario no encontrado");

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if(!result.Succeeded) return BadRequest("Error al agregar los roles");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if(!result.Succeeded) return BadRequest("Error al eliminar los roles");

            return Ok(await userManager.GetRolesAsync(user));
        }
        
    }
}