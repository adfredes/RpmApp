using System;
using System.ComponentModel.DataAnnotations;
namespace API.DTOs
{
    public class CreateClassDto
    {           
        [Required]
        public DateTime DateOfClass { get; set; }
        [Required]
        public int Duration { get; set; }        
        [Required]
        public int LevelId { get; set; }        
        [Required]
        public int Capacity { get; set; }        
        [Required]
        public int TeacherId { get; set; }        

    }
}