using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("UserPhotos")]
    public class AppUserPhoto : Photo
    {
        public bool IsMain { get; set; }
        public bool IsAvatar { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}