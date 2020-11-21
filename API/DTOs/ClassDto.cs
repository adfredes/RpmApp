using System;

namespace API.DTOs
{
    public class ClassDto
    {
        public int Id { get; set; }
        public DateTime DateOfClass { get; set; }
        public int Duration { get; set; }                
        public string Level { get; set; }
        public int Capacity { get; set; }
        public int Quota { get; set; }
        public string Teacher { get; set; }
        public string TeacherPhotoUrl { get; set; }
    }
}