using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MemberController: BaseController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public MemberController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        [HttpGet("teacher")]
        public async Task<ActionResult<ICollection<TeacherDto>>> GetTeachers()
        {
            return Ok(await this.unitOfWork.MemberRepository.GetTeachers());
        }

    }
}