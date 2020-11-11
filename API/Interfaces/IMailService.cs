using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Interfaces
{
    public interface IMailService
    {
        Task<bool> SendMail (string to, string subject, string body, List<string> lbcc = null);
    }
}