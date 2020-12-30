using System;

namespace API.DTOs
{
    public class PaymentDetailDto
    {
        public int Id { get; set; }        
        public DateTime UploadDate { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string TicketUrl { get; set; }         
    }
}