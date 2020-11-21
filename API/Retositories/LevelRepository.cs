using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Retositories
{
    public class LevelRepository : ILevelRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public LevelRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public async Task<ICollection<Level>> GetLevelsAsync()
        {
            return await this.context.Levels
                    .OrderBy(l => l.LevelDescription)
                    .ToListAsync();
        }        
    }
}