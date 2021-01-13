using System;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        public DateTime UploadDate { get; set; } = DateTime.Now.ToUniversalTime();
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string TicketUrl { get; set; }
        public int AppUserId { get; set; }
        public AppUser Member { get; set; }
    }
}