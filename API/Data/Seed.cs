using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed    
    {
        public static async Task SeedUser(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, DataContext dataContext)
        {            
            if (await userManager.Users.AnyAsync()) return;

            // Insert Roles
            var roles = new List<AppRole> {
                new AppRole{Name = "Student"},
                new AppRole{Name = "Teacher"},
                new AppRole{Name = "School"},
                new AppRole{Name = "Admin"}
            };

            foreach(var role in roles){
                await roleManager.CreateAsync(role);
            }

            // Insert DocumentType
            var documentTypes = new List<DocumentType> {
                new DocumentType { DocumentTypeDescription = "DNI"},
                new DocumentType { DocumentTypeDescription = "Pasaporte"}
            };
            
            await dataContext.DocumentTypes.AddRangeAsync(documentTypes);

            //Insert Gender
            var genders = new List<Gender> {
                new Gender {GenderDesciption = "Hombre"},
                new Gender {GenderDesciption = "Mujer"},
                new Gender {GenderDesciption = "Otro"}
            };

            await dataContext.Genders.AddRangeAsync(genders);

            // Insert Levels
            var levels = new List<Level> {
                new Level {LevelDescription = "Principiante"},
                new Level {LevelDescription = "Intermedio"},
                new Level {LevelDescription = "Avanzado"}
            };

            await dataContext.Levels.AddRangeAsync(levels);                                

            await dataContext.SaveChangesAsync();

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            if(users == null) return;

            foreach(var user in users){
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Student");
            }


            //creo usuario admin
            var admin = new AppUser
            {
                UserName = "admin"
            };
            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new [] {"Admin"});

             await SeedClass(dataContext);

        }

        public static async Task SeedClass(DataContext dataContext)
        { 
            // if (await dataContext.Class.AnyAsync()){
            //     return;
                
            //     var clase = await dataContext.Class
            //                     .Include(x => x.StudentsClass)
            //                     .FirstOrDefaultAsync(x => x.Id > 1);

            //     var student = await dataContext.Users.FirstOrDefaultAsync(x=> x.Id>3);

            //     clase.StudentsClass.Add(
            //         new StudentClass {
            //             Class = clase,
            //             User = student
            //         }
            //     );
                
                
            //     dataContext.Class.Update(clase);
                
            // }
            // else{

            
                var clase = new Class
                {                    
                    Capacity = 10,
                    DateOfClass = DateTime.Now,
                    Duration = 60,                    
                    LevelId = 1,
                    Quota = 10,
                    TeacherId = 1,
                };            

                var student = await dataContext.Users.FirstOrDefaultAsync(x=> x.Id>1);

                clase.StudentsClass = new List<StudentClass>
                {
                    new StudentClass {
                        Class = clase,
                        User = student
                    }
                };
                dataContext.Class.Add(clase);
                await dataContext.SaveChangesAsync();
                
            //}
            
        }

        
    }
}