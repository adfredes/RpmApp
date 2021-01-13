using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Retositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public PaymentRepository(DataContext dataContext, IMapper mapper)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
        }

        public async Task<PaymentDetailDto> GetPaymentAsync(int id)
        {
            return await this.dataContext.Payment
                        .Include(p => p.Member)
                        .ProjectTo<PaymentDetailDto>(mapper.ConfigurationProvider)
                        .FirstOrDefaultAsync(p => p.Id == id);
            
        }

        public async Task<PagedList<PaymentDetailDto>> GetPaymentsAsync(PaymentParams paymentParams)
        {
            var query = dataContext.Payment
                        .Include(p => p.Member)
                        .OrderByDescending(p => p.PaymentDate)
                            .ThenBy(p => p.Member.LastName)
                            .ThenBy(p => p.Member.FirstName)
                        .AsQueryable()
                        .Where(p => p.PaymentDate >= paymentParams.BeginDate && p.PaymentDate <= paymentParams.EndDate );
            
            if(paymentParams.UsuarioId > 0){
                query = query.Where(p => p.Member.Id == paymentParams.UsuarioId);
            }
            
            return await PagedList<PaymentDetailDto>.CreateAsync(query.ProjectTo<PaymentDetailDto>(mapper.ConfigurationProvider),paymentParams.PageNumber, paymentParams.PageSize);
        }

        public async Task<ICollection<PaymentDetailDto>> GetPaymentsByMemberIdAsync(int id)
        {
             var query = dataContext.Payment
                        .Include(p => p.Member)
                        .OrderByDescending(p => p.PaymentDate)                         
                        .AsQueryable()
                        .Where(p => p.Member.Id == id);
            
            
            
            return await query.ProjectTo<PaymentDetailDto>(mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task DeletePayment(int id){
            var payment = await dataContext.Payment.FindAsync(id);
            dataContext.Payment.Remove(payment);
        }
    }
}