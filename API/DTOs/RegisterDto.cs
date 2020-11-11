using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {        
        [StringLength(255, MinimumLength = 6)]
        [Required] public string Username { get; set; }
        public string KnownAs { get; set; }
        [Required] public int GenderId { get; set; }
        [Required] public DateTime DateOfBirth { get; set; }
        [Required] public string City { get; set; }
        [Required] public int DocumentTypeId { get; set; }
        [Required] public string DocumentNumber { get; set; }
        [Required] public string Email { get; set; }
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        
        [Required]       
        [StringLength(20, MinimumLength = 6)] 
        public string Password { get; set; }
    }
}