using System.Collections.Generic;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface ILevelRepository
    {
        Task<ICollection<Level>> GetLevelsAsync();
    }
}