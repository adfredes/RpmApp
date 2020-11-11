using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options){}     

        public DbSet<DocumentType> DocumentTypes { get; set; }   
        public DbSet<Level> Levels { get; set; }
        public DbSet<Gender> Genders { get; set; }

        public DbSet<Class> Class { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<StudentClass>()
                .HasKey(k => new {k.UserId, k.ClassId});

            builder.Entity<Class>()
                .HasKey(c => c.Id);

            builder.Entity<Class>()
                .HasMany(c => c.StudentsClass)
                .WithOne(c => c.Class)
                .HasForeignKey(c => c.ClassId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();
            
            builder.Entity<AppUser>()
                .HasMany(ur => ur.StudentsClass)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Class>()
                .HasOne(u => u.Teacher)
                .WithMany(u => u.Classes)
                .HasForeignKey(u => u.TeacherId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(r => r.Role)
                .HasForeignKey(ur => ur.RoleId);
        }
    }
}