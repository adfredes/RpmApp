using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Levels")]
    public class Level    
    {
        public int Id { get; set; }
        public string LevelDescription { get; set; }
    }
}