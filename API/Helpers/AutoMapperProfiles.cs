using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
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

            CreateMap<AppUserPhoto, PhotoDto>()
            .ReverseMap();
            

            CreateMap<TeacherDto, AppUser>()
            .ReverseMap();

            CreateMap<AppUser, MemberDto>()
            .ForMember(d => d.Level, o => o.MapFrom(s => s.Level.LevelDescription))
            .ForMember(d => d.Gender, o => o.MapFrom(s => s.Gender.GenderDesciption))
            .ForMember(d => d.DocumentType, o => o.MapFrom(s => s.DocumentType.DocumentTypeDescription))
            .ForMember(d => d.PhotoUrl, o => o.MapFrom(s => s.Photos.Where(p => p.IsAvatar == true).Select(p => p.Url).FirstOrDefault()))
            .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.Value.CalculateAge()))
            .ReverseMap();

            CreateMap<MemberEditDto, AppUser>()
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
            
            CreateMap<AppUser, UserAccountDto>()
            .ForMember(d => d.Roles, o => o.MapFrom(s => s.UserRoles.Select(r => r.Role.Name).ToList()));

            /***************combo**************/
            CreateMap<AppRole, ComboDto>()
            .ForMember(d => d.value, o => o.MapFrom(s => s.Name))
            .ForMember(d => d.text, o => o.MapFrom(s => s.Name));
        }
        
    }
}