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
    public class MemberRepository : IMemberRepository
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public MemberRepository(DataContext dataContext, IMapper mapper)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
        }
        public async Task<ICollection<TeacherDto>> GetTeachers()
        {
            return await dataContext.Users
                        .Where(u => u.UserRoles.Any(r => r.Role.NormalizedName=="TEACHER"))
                        .ProjectTo<TeacherDto>(mapper.ConfigurationProvider)
                        .ToListAsync();
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            username = username.ToLower();
            return await dataContext.Users
                .Include(p => p.Photos)
                .Where(m => m.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();                        
        }

        public async Task<AppUser> GetMemberByUsernameAsync(string username)
        {
            return await dataContext.Users            
                        .Include(p => p.Payments)                        
                        .Include(p => p.Photos)                                            
                        .SingleOrDefaultAsync(user => user.UserName == username);
        }

        public async Task UpdateMember(MemberEditDto memberDto, string username)
        {
            username = username.ToLower();
            var member = await dataContext.Users.FirstOrDefaultAsync(x => x.UserName == username);
            mapper.Map(memberDto, member);
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(MembersParams membersParams)
        {
            var query = dataContext.Users.AsQueryable();

            if(!string.IsNullOrEmpty(membersParams.Gender)){
                query = query.Where(m => m.Gender.GenderDesciption == membersParams.Gender);
            }

            if(!string.IsNullOrEmpty(membersParams.Level)){
                query = query.Where(m => m.Level.LevelDescription == membersParams.Level);
            }

            if(!string.IsNullOrEmpty(membersParams.Role)){
                query = query.Where(m => m.UserRoles.Any(r => r.Role.Name == membersParams.Role));
            }

            return await PagedList<MemberDto>.CreateAsync(
                query.ProjectTo<MemberDto>(mapper.ConfigurationProvider).AsNoTracking(),
                membersParams.PageNumber, membersParams.PageSize);
        }
    }
}