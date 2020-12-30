using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MemberController: BaseController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly ICloudinaryService cloudinaryService;

        public MemberController(IUnitOfWork unitOfWork, IMapper mapper, ICloudinaryService cloudinaryService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.cloudinaryService = cloudinaryService;
        }

        [HttpGet("teacher")]
        public async Task<ActionResult<ICollection<TeacherDto>>> GetTeachers()
        {
            return Ok(await this.unitOfWork.MemberRepository.GetTeachers());
        }

        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await unitOfWork.MemberRepository.GetMemberAsync(username);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers([FromQuery] MembersParams membersParams){
            var members = await unitOfWork.MemberRepository.GetMembersAsync(membersParams);
            Response.AddPaginationHeader(members);
            return Ok(members);
        }

        [HttpPatch]
        public async Task<ActionResult<MemberDto>> UpdateMember(MemberEditDto member)
        {
            var username = HttpContext.User.GetUsername();
            await unitOfWork.MemberRepository.UpdateMember(member, username);
            if(await unitOfWork.Complete()){                
                return Ok(await unitOfWork.MemberRepository.GetMemberAsync(username));
            }
            return BadRequest("Se produjo un error");
        }




        /**************************Photo Services***********************************/
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await unitOfWork.MemberRepository.GetMemberByUsernameAsync(User.GetUsername());

            var result = await cloudinaryService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new AppUserPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if (await unitOfWork.Complete())
                // return CreatedAtRoute("GetUser",photo.Url, mapper.Map<PhotoDto>(photo));            
                return CreatedAtRoute("GetUser", new { username = user.UserName, photo.Url }, mapper.Map<PhotoDto>(photo));

            return BadRequest("Problem adding photo");

        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {

            var user = await unitOfWork.MemberRepository.GetMemberByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("Esta foto ya es la principañ");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) {
                currentMain.IsMain = false;
                currentMain.IsAvatar = false;
            }
            photo.IsMain = true;
            photo.IsAvatar = true;

            if (await unitOfWork.Complete()) return NoContent();
            return BadRequest("Failed to set main photo");

        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await unitOfWork.MemberRepository.GetMemberByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("No puedes eliminar tu foto principal");

            if (photo.PublicId != null)
            {
                var result = await cloudinaryService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("Fallo al eliminar la foto");

        }       

        /****************Payment Service*********************/
        [HttpPost("add-payment")]
        public async Task<ActionResult<PaymentDetailDto>> AddTicket(IFormFile file , [FromQuery] PaymentDto  paymentDto)
        {
            if(file == null) return BadRequest("File is null");
            var user = await unitOfWork.MemberRepository.GetMemberByUsernameAsync(User.GetUsername());

            var result = await cloudinaryService.AddFileAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            DateTime paymentDate = new DateTime(paymentDto.Year, paymentDto.Month, 1).ToUniversalTime();            
            var payment = new Payment
            {
                Amount = paymentDto.Amount,
                PaymentDate = paymentDate,                
                TicketUrl = result.SecureUrl.AbsoluteUri                
                //PublicId = result.PublicId
            };

             user.Payments.Add(payment);

            if (await unitOfWork.Complete())
                // return CreatedAtRoute("GetUser",photo.Url, mapper.Map<PhotoDto>(photo));            
                return CreatedAtRoute("GetUser", new { username = user.UserName, payment.TicketUrl }, mapper.Map<PaymentDetailDto>(payment));

            return BadRequest("Problem adding payment");
            

        } 

        [HttpGet("list-payment")]
        public async Task<ActionResult<IEnumerable<PaymentDetailDto>>> ListPayment()
        {
            var user = await unitOfWork.MemberRepository.GetMemberByUsernameAsync(User.GetUsername());
            var payments = mapper.Map<IEnumerable<PaymentDetailDto>>(user.Payments.OrderByDescending(p => p.PaymentDate));
            return Ok(payments);
        }
    }
}