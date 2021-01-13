using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PaymentsController: BaseController
    {
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;

        public PaymentsController(IMapper mapper, IUnitOfWork unitOfWork)
        {
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDetailDto>> GetPayment(int id)
        {            
            var payment = await unitOfWork.PaymentRepository.GetPaymentAsync(id);
            return Ok(payment);
        }

        [HttpGet("list")]
        public async Task<ActionResult<PagedList<PaymentDetailDto>>> GetPayments([FromQuery] PaymentParams paymentParams)
        {            
            var payments = await unitOfWork.PaymentRepository.GetPaymentsAsync(paymentParams);
            return Ok(payments);
        }       
    }
}