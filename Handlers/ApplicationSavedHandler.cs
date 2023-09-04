using Database;
using DatabaseExtensionKit.Notifications;
using DatabaseExtensionKitDemo.Models;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Security;
using UmbracoCareer.Models;
using UmbracoCareer.Repository;
using static Umbraco.Cms.Core.Constants.PropertyEditors;

namespace UmbracoCareer.Handlers
{
    public class ApplicationSavedHandler : INotificationHandler<DbExtEntitySavedNotification>
    {
        private readonly IBackOfficeSecurityAccessor backOfficeSecurity;
        private readonly IJobRepository jobRepo;

        public ApplicationSavedHandler(IBackOfficeSecurityAccessor backOfficeSecurity, IJobRepository jobRepo)
        {
            this.jobRepo = jobRepo;
            this.backOfficeSecurity = backOfficeSecurity ?? throw new System.ArgumentNullException(nameof(backOfficeSecurity));
        }

        public void Handle(DbExtEntitySavedNotification notification)
        {
            if (backOfficeSecurity.BackOfficeSecurity == null || backOfficeSecurity.BackOfficeSecurity.CurrentUser == null) return;

            if (notification.Item.Name == ObjectTypes.Application)
            {
                var status = notification.Item.Properties.FirstOrDefault(x => x.Alias == Properties.ApplicationStatus);
     
                if (status != null && status.Value != null && status.Editor != Aliases.Label)
                {
                    var appStatus = jobRepo.GetLastApplicationStatus(notification.Item.Id);
                    if (appStatus == null || appStatus.Status != status.Value.ToString())
                    {
                        appStatus = new StatusChange();
                        appStatus.ApplicationFK = notification.Item.Id;
                        appStatus.Valid = 1;
                        appStatus.Status = status.Value.ToString();
                    }

                    appStatus.ChangeTime = DateTime.Now;
                    var note = notification.Item.Properties.FirstOrDefault(x => x.Alias == Properties.Note);
                    appStatus.Note = note != null && note.Value != null ? note.Value.ToString() : "";
                    appStatus.User = backOfficeSecurity.BackOfficeSecurity.CurrentUser.Name;

                    jobRepo.SaveStatusChange(appStatus);
                }
            }
        }
    }
}
