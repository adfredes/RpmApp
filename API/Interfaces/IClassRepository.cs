using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IClassRepository
    {
        void Add(Class _class);
        void Update(Class _class);
        Task<ClassDto> GetClassAsync (int id);
        Task<PagedList<ClassDto>> GetClassesAsync(ClassParams classParams);
        Task<ClassDetailsDto> GetClassDetailsAsync(int classId);
        Task SetStudentAsist(int classId, int studentId, bool isAsist);
        Task<bool> SubscribeStudent(int classId, int userId);
        Task UnsubscribeStudent(int classId, int userId);

        
    }
}