using System;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class PaymentDto
    {                        
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Amount { get; set; }                    
    }
}