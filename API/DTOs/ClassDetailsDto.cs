using System.Collections.Generic;

namespace API.DTOs
{
    public class ClassDetailsDto: ClassDto
    {
        public ICollection<ClassSubscription> StudentsSubscription { get; set; }
    }
}