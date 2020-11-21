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
    public class ClassRepository : IClassRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public ClassRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public void Add(Class _class)
        {
            context.Class.Add(_class);
        }

        public async Task<ClassDto> GetClassAsync(int id)
        {
            return await context.Class
                            .Include(us => us.StudentsClass)
                            .ThenInclude(r => r.User)
                            .ProjectTo<ClassDto>(mapper.ConfigurationProvider)
                            .SingleOrDefaultAsync(c => c.Id == id);


        }

        public async Task<ClassDetailsDto> GetClassDetailsAsync(int classId)
        {
            return await context.Class
                            .Include(c => c.StudentsClass)
                            .ThenInclude(u => u.User)
                            .ProjectTo<ClassDetailsDto>(mapper.ConfigurationProvider)
                            .FirstOrDefaultAsync(c => c.Id == classId);
        }

        public async Task<PagedList<ClassDto>> GetClassesAsync(ClassParams classParams)
        {
            var query = context.Class                            
                            .Include(t => t.Teacher)
                            .OrderBy(c => c.DateOfClass)
                            .AsQueryable();

            classParams.EndDate = classParams.EndDate.AddDays(1);
            query = query.Where(c => c.DateOfClass >= classParams.BeginDate && c.DateOfClass <= classParams.EndDate);            

            if (classParams.LevelId.HasValue)
            {
                query = query.Where(c => c.LevelId == classParams.LevelId.Value);
            }

            if (classParams.TeacherId.HasValue)
            {
                query = query.Where(c => c.TeacherId == classParams.TeacherId.Value);
            }       

            return await PagedList<ClassDto>.CreateAsync(query.ProjectTo<ClassDto>(mapper.ConfigurationProvider), classParams.PageNumber, classParams.PageSize);
        }

        public async Task SetStudentAsist(int classId, int studentId, bool isAsist)
        {
            var leason = await context.Class.Include(s => s.StudentsClass)
                            .FirstOrDefaultAsync(c => c.Id == classId);
            
            var subscription = leason.StudentsClass.FirstOrDefault(s => s.UserId == studentId);
            if(subscription != null)
            {
                subscription.IsAssist = isAsist;
            }
        }

        public async Task<bool> SubscribeStudent(int classId, int userId)
        {
            var leason = await context.Class.Include(c => c.StudentsClass)
                            .FirstOrDefaultAsync(c => c.Id == classId);
            
            if(leason.StudentsClass.Any(c => c.UserId == userId))
            {
                throw new System.Exception("Ya te encuentras inscripto");
            }

            if(leason.Quota == 0)
            {                 
                throw new System.Exception("No hay cupo disponible");
            }

            leason.Quota -= 1;
            var subscription = new StudentClass{
                ClassId = classId,
                UserId = userId
            };

            leason.StudentsClass.Add(subscription);

            return true;

        }

        public async Task UnsubscribeStudent(int classId, int userId)
        {
             var leason = await context.Class.Include(c => c.StudentsClass)
                            .FirstOrDefaultAsync(c => c.Id == classId);
            
            var subscription = leason.StudentsClass.FirstOrDefault(c => c.UserId == userId);

            if(subscription == null)
            {
                throw new System.Exception("El estudiante no se encuentra inscripto");
            }            

            leason.Quota += 1;            

            leason.StudentsClass.Remove(subscription);
        }

        public void Update(Class _class)
        {
            context.Entry(_class).State = EntityState.Modified;
        }
    }
}