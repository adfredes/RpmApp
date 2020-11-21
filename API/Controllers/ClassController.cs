using API.Entities;
using API.DTOs;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using API.Extensions;
using System.Collections;
using System.Collections.Generic;

namespace API.Controllers
{
    public class ClassController: BaseController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public ClassController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }
        
        [HttpGet("{id}", Name = "GetClass")]
        public async Task<ActionResult<ClassDto>> GetClass(int id)
        {
            return await unitOfWork.ClassRepository.GetClassAsync(id);
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<ClassDto>>> GetClasses([FromQuery] ClassParams classParams)
        {
            var classes = await unitOfWork.ClassRepository.GetClassesAsync(classParams);
            Response.AddPaginationHeader<ClassDto>(classes);
            return classes;
        }

        [HttpPost]
        public async Task<ActionResult<ClassDto>> AddClass(CreateClassDto createClassDto)
        {
            var newClass = mapper.Map<Class>(createClassDto);
            unitOfWork.ClassRepository.Add(newClass);
            if (await unitOfWork.Complete()) return Ok(mapper.Map<ClassDto>(newClass));
            return BadRequest("Fallo al agregar la nueva clase");
        }        

        [HttpGet("level")]
        public async Task<ActionResult<ICollection<LevelDto>>> GetLevels()
        {
            var levels = mapper.Map<List<LevelDto>>(await unitOfWork.LevelRepository.GetLevelsAsync());
            return Ok(levels);
        }
        
        
    }
}