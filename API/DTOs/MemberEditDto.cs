using System;

namespace API.DTOs
{
    public class MemberEditDto
    {
        public string KnownAs { get; set; }                
        // public ICollection<AppUserPhoto> Photos { get; set; }     
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }                
        public int? GenderId { get; set; }        
        public int? DocumentTypeId { get; set; }
        public string DocumentNumber { get; set; }                
        public int? LevelId { get; set; }        
        public string City { get; set; }
        public string PhoneNumber { get; set; }
    }
}