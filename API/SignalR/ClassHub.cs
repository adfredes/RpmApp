using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using API.Extensions;
using System.Linq;
using API.DTOs;

namespace API.SignalR
{
    public class ClassHub: Hub
    {
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly List<Group> groups;

        public ClassHub(IMapper mapper, IUnitOfWork unitOfWork)
        {
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.groups = new List<Group>();
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var classId = Convert.ToInt32(httpContext.Request.Query["classid"].ToString());
            var groupName = GetGroupName(classId);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var leason = await GetClassDetails(classId);
            await Clients.Caller.SendAsync("UpdatedClass", leason);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            RemoveConnection();
            await base.OnDisconnectedAsync(exception);
             
        }

        public async Task EditClass(ClassEditDto leason)
        {
            
            try{
                await unitOfWork.ClassRepository.UpdateClass(leason);
                await unitOfWork.Complete();
            }catch (Exception ex){
                throw ex;
            }
            await EmmitUpdateClassToGroup(leason.Id);
        }

        public async Task SubscribeClass(int classid){
            var userId = Context.User.GetUserId();
            do
            {
                try{
                    await unitOfWork.ClassRepository.SubscribeStudent(classid, userId);
                }catch(Exception ex){                    
                    throw new HubException(ex.Message);
                }         
            }while (!await unitOfWork.Complete());
            await EmmitUpdateClassToGroup(classid);
            
            // if (await unitOfWork.ClassRepository.SubscribeStudent(classid, userId))
            // {
            //     if(await unitOfWork.Complete()){
            //         await EmmitUpdateClassToGroup(classid);
            //     }
            // }            
        }

        public async Task UnsubscribeClass(int classid){
            var userId = Context.User.GetUserId();

            do
            {
                try{
                    await unitOfWork.ClassRepository.UnsubscribeStudent(classid, userId);
                }catch(Exception ex){                    
                    throw new HubException(ex.Message);
                }         
            }while (!await unitOfWork.Complete());
            await EmmitUpdateClassToGroup(classid);
            
            // await unitOfWork.ClassRepository.UnsubscribeStudent(classid, userId);            
            //     if(await unitOfWork.Complete()){
            //         await EmmitUpdateClassToGroup(classid);
            //     }                        
        }

        public async Task StudentAsist(int classId, int studentId, bool isAsist)
        {
            await unitOfWork.ClassRepository.SetStudentAsist(classId,studentId,isAsist);
            if(unitOfWork.Haschange()){
                await unitOfWork.Complete();
            }
            await EmmitUpdateClassToGroup(classId);
        }

        private async Task EmmitUpdateClassToGroup(int id)
        {
            var leason = await GetClassDetails(id);
            var groupName = GetGroupName(id);
            await Clients.Group(groupName).SendAsync("UpdatedClass", leason);
        }

        private void AddToGroup(string groupName)
        {
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());
            var group = groups.FirstOrDefault(g => g.Name == groupName);
            if (group == null){
                group = new Group(groupName);
                groups.Add(group);
            }

            group.Conections.Add(connection);            
        }

        private void RemoveConnection()
        {
            var group = groups.FirstOrDefault(g => g.Conections.Any(c => c.ConnectionId == Context.ConnectionId));            
            if(group != null)
            {
                var connection = group.Conections.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);
                group.Conections.Remove(connection);
                if(group.Conections.Count <= 0)
                {
                    groups.Remove(group);
                }
            }                        
        }

        private async Task<ClassDetailsDto> GetClassDetails(int id){
            return await unitOfWork.ClassRepository.GetClassDetailsAsync(id);
        }

        private string GetGroupName(int classId){
            return $"class-{classId.ToString()}";
        }

        

        
        
    }
}