using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IUnitOfWork
    {
        IClassRepository ClassRepository {get; }
        ILevelRepository LevelRepository {get; }
        IMemberRepository MemberRepository {get; }
        Task<bool> Complete();
        bool Haschange();
    }
}