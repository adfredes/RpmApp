using System;

namespace API.Helpers
{
    public class PaymentParams
    : PaginationParams
    {
        public DateTime BeginDate { get; set; } = DateTime.Today.AddDays(-90);
        public DateTime EndDate { get; set; } = DateTime.Today;
        public int UsuarioId { get; set; } = 0;
    }
}