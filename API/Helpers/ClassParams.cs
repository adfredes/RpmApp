using System;

namespace API.Helpers
{
    public class ClassParams: PaginationParams
    {
        public DateTime BeginDate { get; set; } = DateTime.Today;
        public DateTime EndDate { get; set; } = DateTime.Today.AddDays(7);
        public int? LevelId { get; set; }
        public int? StudentId { get; set; }
        public int? TeacherId { get; set; }
        public bool Suspended { get; set; }
    }
}