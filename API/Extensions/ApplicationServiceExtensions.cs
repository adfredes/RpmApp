using System.Linq;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using  API.Errors;
using API.Retositories;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services, IConfiguration config
        ){
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.Configure<MailSenderSettings>(config.GetSection("MailSenderSettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IMailService, MailService>();            
            services.AddScoped<ICloudinaryService, CloudinaryService>();

            services.AddScoped<IClassRepository, ClassRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>( options => {
                var connStr = config.GetConnectionString("DefaultConnection");
                options.UseSqlite(connStr);
            });

            services.Configure<ApiBehaviorOptions>( options => 
            {
                options.InvalidModelStateResponseFactory = actionContext => {
                    var errors = actionContext.ModelState
                                 .Where(e => e.Value.Errors.Count > 0)
                                 .SelectMany(x => x.Value.Errors)
                                 .Select(x => x.ErrorMessage).ToArray();
                    var errorResponse = new ApiValidationResponse
                    {
                        Errors = errors
                    };
                    return new BadRequestObjectResult(errorResponse);
                };
            });
            
            return services;            
        }
        
    }
}