using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class Class
    {
        public int Id { get; set; }
        public DateTime DateOfClass { get; set; }
        public DateTime? BeginTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int LevelId { get; set; }
        public Level Level { get; set; }
        public int Capacity { get; set; }
        public int Quota { get; set; }        
        
        public ICollection<StudentClass> StudentsClass { get; set; }
        
        public int TeacherId { get; set; }
        public AppUser Teacher { get; set; }


    }
}