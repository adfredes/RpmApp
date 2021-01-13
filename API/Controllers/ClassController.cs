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
using System;

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
            Response.AddPaginationHeader(classes);
            return classes;
        }

        [HttpPost]
        public async Task<ActionResult<ClassDto>> AddClass(CreateClassDto createClassDto)
        {
            var newClass = mapper.Map<Class>(createClassDto);
            unitOfWork.ClassRepository.Add(newClass);
            if (await unitOfWork.Complete()) return Ok(await unitOfWork.ClassRepository.GetClassAsync(newClass.Id));
            return BadRequest("Fallo al agregar la nueva clase");
        }

        // [HttpPut]
        // public async Task<ActionResult<ClassDto>> EditClass(ClassEditDto classDto)
        // {
        //     try{
        //         await unitOfWork.ClassRepository.UpdateClass(classDto);            
        //         if (await unitOfWork.Complete()) return Ok(await unitOfWork.ClassRepository.GetClassAsync(classDto.Id));
        //         return BadRequest("Fallo al agregar la nueva clase");
        //     }catch(Exception ex){
        //         return BadRequest(ex.ToString());
        //     }
            
        // }        

         // try{
            //     await unitOfWork.ClassRepository.UpdateClass(classDto);
            //     await unitOfWork.Complete();
            // }catch (Exception ex){
            //     throw ex;
            // }
            // await EmmitUpdateClassToGroup(classDto.Id);

        [HttpGet("level")]
        public async Task<ActionResult<ICollection<LevelDto>>> GetLevels()
        {
            var levels = mapper.Map<List<LevelDto>>(await unitOfWork.LevelRepository.GetLevelsAsync());
            return Ok(levels);
        }

        [HttpPut("{id}/suspend/{suspended}")]
        public async Task<ActionResult> SuspendClass(int id, bool suspended){
            await unitOfWork.ClassRepository.Suspend(id, suspended);
            if (await unitOfWork.Complete()) return Ok();            
            return BadRequest("Fallo al suspender la clase");
        }
        
        
    }
}