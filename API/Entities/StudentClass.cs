namespace API.Entities
{
    public class StudentClass
    {
        public int ClassId { get; set; }
        public Class Class { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }
        public bool? IsAssist { get; set; }
    }
}