namespace API.Helpers
{
    public class MembersParams: PaginationParams
    {
        public string Gender { get; set; }
        public string Level { get; set; }
        public string Role { get; set; } = "Student";

        
    }
}