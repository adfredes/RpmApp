using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<RegisterDto, AppUser>();

            CreateMap<CreateClassDto, Class>()
            .ForMember(d => d.Quota, o => o.MapFrom(s => s.Capacity));            

            CreateMap<Class, ClassDto>() 
            .ForMember(d => d.Level, o => o.MapFrom(s => s.Level.LevelDescription))
            .ForMember(d => d.Teacher, o => o.MapFrom(s => $"{s.Teacher.FirstName} {s.Teacher.LastName}"))
            .ForMember(d => d.TeacherPhotoUrl, o => o.MapFrom(s => s.Teacher.Photos.Where(p => p.IsAvatar == true).Select(p => p.Url).FirstOrDefault()));
            
            CreateMap<Level, LevelDto>()
            .ReverseMap();

            CreateMap<TeacherDto, AppUser>()
            .ReverseMap();

            CreateMap<StudentClass, ClassSubscription>()
            .ForMember(d => d.StudentId, o => o.MapFrom(s => s.UserId))
            .ForMember(d => d.Name, o => o.MapFrom(s => $"{s.User.FirstName} {s.User.LastName}"))
            .ForMember(d => d.Avatar, o => o.MapFrom(s => s.User.Photos.Where(p => p.IsAvatar == true).Select(p => p.Url).FirstOrDefault()));

            CreateMap<Class, ClassDetailsDto>() 
            .ForMember(d => d.Level, o => o.MapFrom(s => s.Level.LevelDescription))
            .ForMember(d => d.Teacher, o => o.MapFrom(s => $"{s.Teacher.FirstName} {s.Teacher.LastName}"))
            .ForMember(d => d.TeacherPhotoUrl, o => o.MapFrom(s => s.Teacher.Photos.Where(p => p.IsAvatar == true).Select(p => p.Url).FirstOrDefault()))
            .ForMember(d => d.StudentsSubscription, o => o.MapFrom(s => s.StudentsClass));
            
        }
        
    }
}