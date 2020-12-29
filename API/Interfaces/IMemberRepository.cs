using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMemberRepository
    {
        Task<ICollection<TeacherDto>> GetTeachers();
        Task<MemberDto> GetMemberAsync(string username);    
        Task<PagedList<MemberDto>> GetMembersAsync(MembersParams membersParams);  
        Task UpdateMember(MemberEditDto memberDto, string username);        

        Task<AppUser> GetMemberByUsernameAsync(string username);
    }
}