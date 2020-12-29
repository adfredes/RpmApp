using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class MemberDto
    {
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }        
        // public ICollection<AppUserPhoto> Photos { get; set; }     

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime? DateOfAdmission { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public int? GenderId { get; set; }
        public string DocumentType { get; set; }
        public int? DocumentTypeId { get; set; }
        public string DocumentNumber { get; set; }        
        public string Level { get; set; }
        public int? LevelId { get; set; }        
        public string City { get; set; }
        public string PhoneNumber { get; set; }
        public string PhotoUrl { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}