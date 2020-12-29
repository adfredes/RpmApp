using API.Data;
using API.Interfaces;
using AutoMapper;
using System.Threading.Tasks;

namespace API.Retositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public UnitOfWork(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }
        public IClassRepository ClassRepository => new ClassRepository(context, mapper);

        public ILevelRepository LevelRepository => new LevelRepository(context, mapper);

        public IMemberRepository MemberRepository => new MemberRepository(context, mapper);        

        public async Task<bool> Complete()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public bool Haschange()
        {
            return context.ChangeTracker.HasChanges();
        }
    }
}