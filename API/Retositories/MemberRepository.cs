using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
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
    }
}