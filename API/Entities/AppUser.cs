using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser : IdentityUser<int>
    {
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;        
        public ICollection<AppUserRole> UserRoles {get; set;}   
        public ICollection<AppUserPhoto> Photos { get; set; }     

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? DateOfAdmission { get; set; }
        public Gender Gender { get; set; }
        public int? GenderId { get; set; }
        public DocumentType DocumentType { get; set; }
        public int? DocumentTypeId { get; set; }
        public string DocumentNumber { get; set; }        
        public Level Level { get; set; }
        public int? LevelId { get; set; }        
        public string City { get; set; }

        public ICollection<StudentClass> StudentsClass { get; set; }
        public ICollection<Class> Classes { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}