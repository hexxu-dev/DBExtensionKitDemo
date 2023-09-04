using Database;
using DatabaseExtensionKit.Models;
using DatabaseExtensionKit.Notifications;
using DatabaseExtensionKitDemo.Models;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Web.Common.Security;
using UmbracoCareer.Repository;
using static Umbraco.Cms.Core.Constants.PropertyEditors;
using ObjectTypes = DatabaseExtensionKitDemo.Models.ObjectTypes;

namespace UmbracoCareer.Handlers
{
    public class ApplicationPreLoadHandler : INotificationHandler<DbExtEntityPreLoadNotification>
    {
        private readonly IBackOfficeSecurityAccessor backOfficeSecurity;
        private readonly IJobRepository jobRepo;
        public ApplicationPreLoadHandler(IBackOfficeSecurityAccessor backOfficeSecurity, IJobRepository jobRepo)
        {
            this.jobRepo = jobRepo;
            this.backOfficeSecurity = backOfficeSecurity ?? throw new System.ArgumentNullException(nameof(backOfficeSecurity));
        }
        public void Handle(DbExtEntityPreLoadNotification notification)
        {
            if (backOfficeSecurity.BackOfficeSecurity == null || backOfficeSecurity.BackOfficeSecurity.CurrentUser == null) return;

            if (backOfficeSecurity.BackOfficeSecurity.CurrentUser.Groups.Any(g => g.Alias == UserGroups.Recruiter))
            {
                if (notification.DocumentType.Name == ObjectTypes.Application)
                {
                    var currentStatus = jobRepo.GetLastApplicationStatus(notification.Item.Id);

                    if (currentStatus != null)
                    {
                        switch (currentStatus.Status)
                        {
                            case ApplicationStatus.Submitted:
                                HandlerHelper.setListForProperty(notification.DocumentType, Properties.ApplicationStatus, new List<string> { ApplicationStatus.Shortlisted, ApplicationStatus.Rejected });
                                break;
                            case ApplicationStatus.Shortlisted:
                                setLabelProperties(notification, new List<string> { Properties.Bookmarked });    
                                break;
                            case ApplicationStatus.Interviewed:
                                cleanNote(notification.Item);
                                setLabelProperties(notification, new List<string> { Properties.ApplicationStatus, Properties.Note });
                                HandlerHelper.setListForProperty(notification.DocumentType, Properties.ApplicationStatus, new List<string> { ApplicationStatus.Rejected, ApplicationStatus.Employeed });
                                break;
                            default:
                                setLabelProperties(notification);
                                break;
                        }
                    }
                } 

            }
            else if (backOfficeSecurity.BackOfficeSecurity.CurrentUser.Groups.Any(g => g.Alias == UserGroups.Interviewer))
            {
                if (notification.DocumentType.Name == ObjectTypes.Job)
                {
                    setLabelProperties(notification);
                }
                else if (notification.DocumentType.Name == ObjectTypes.Application)
                {
                    cleanNote(notification.Item);
                    setLabelProperties(notification, new List<string> { Properties.ApplicationStatus, Properties.Note });
                    HandlerHelper.setListForProperty(notification.DocumentType, Properties.ApplicationStatus, new List<string> { ApplicationStatus.Interviewed });
                }
            }
        }

        private void cleanNote(ObjectOM item)
        {
            var noteProp = item.Properties.FirstOrDefault(x => x.Alias == Properties.Note);

            if (noteProp != null)
            {
                noteProp.Value = null;
            }
        }

        private void setLabelProperties(DbExtEntityPreLoadNotification notification, List<string> excludeList = null)
        {
            foreach (var prop in notification.DocumentType.Groups.FirstOrDefault().Properties)
            {
                if (excludeList== null || !excludeList.Contains(prop.Alias))
                {
                    prop.Editor = Aliases.Label;
                    prop.View = "readonlyvalue";
                }
            }
        }
    }
}

        

