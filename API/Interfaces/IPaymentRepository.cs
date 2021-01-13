using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IPaymentRepository
    {
        Task<PaymentDetailDto> GetPaymentAsync(int id);
        Task<PagedList<PaymentDetailDto>> GetPaymentsAsync(PaymentParams paymentParams);        
        Task<ICollection<PaymentDetailDto>> GetPaymentsByMemberIdAsync(int id);
        Task DeletePayment(int id);
    }    
}