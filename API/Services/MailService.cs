using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class MailService : IMailService
    {
        private readonly MailSenderSettings settings;

        public MailService(IOptions<MailSenderSettings> config)
        {
            this.settings = config.Value;
        }
        public async Task<bool> SendMail(string to, string subject, string body, List<string> lbcc = null)
        {
            using var  client = new SmtpClient
             {
                    Host = settings.Host,
                    Port = settings.Port,
                    EnableSsl = settings.Ssl,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(settings.User, settings.Pass)                    
            };

            var sender = new MailAddress(settings.From);
            var receiver = new MailAddress(to);
            using var message = new MailMessage(sender, receiver)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            //client.SendAsync(message, null);

            try{
                await client.SendMailAsync(message);
                return true;
            }
            catch
            {
                return false;
            }            
        }
    }
}