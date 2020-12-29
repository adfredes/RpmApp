using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class UserAccountDto
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
         public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }  
        public ICollection<string> Roles { get; set; }
    }
}