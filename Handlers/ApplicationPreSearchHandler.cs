using Newtonsoft.Json;
using DatabaseExtensionKit.Models;
using DatabaseExtensionKit.Notifications;
using System.Reflection;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models.ContentEditing;
using Umbraco.Cms.Core.Security;
using UmbracoCareer.Handlers;
using UmbracoCareer.Repository;
using static Umbraco.Cms.Core.Constants.PropertyEditors;
using DatabaseExtensionKitDemo.Models;
using Database;

namespace UmbracoCareer.handlers
{
    public class ApplicationPreSearchHandler : INotificationHandler<DbExtPreSearchNotification>
    {
        private readonly IBackOfficeSecurityAccessor backOfficeSecurity;

        public ApplicationPreSearchHandler(IBackOfficeSecurityAccessor backOfficeSecurity)
        {
            this.backOfficeSecurity = backOfficeSecurity ?? throw new System.ArgumentNullException(nameof(backOfficeSecurity));
        }

        public void Handle(DbExtPreSearchNotification notification)
        {
            if (backOfficeSecurity.BackOfficeSecurity == null || backOfficeSecurity.BackOfficeSecurity.CurrentUser == null) return;

                if (backOfficeSecurity.BackOfficeSecurity.CurrentUser.Groups.Any(g => g.Alias == UserGroups.Interviewer))
            {
                if (notification.Item.Name == ObjectTypes.Application)
                {
                    var allFilters = notification.Search.Filters;
                    var statusFilter = allFilters.FirstOrDefault(x => x.Alias == Properties.ApplicationStatus);
                    if (statusFilter != null)
                    {
                        statusFilter.Value = JsonConvert.SerializeObject(new List<string> { ApplicationStatus.Shortlisted });
                    }

                    HandlerHelper.setListForProperty(notification.Item, Properties.ApplicationStatus, new List<string> { ApplicationStatus.Shortlisted });
                }
            }
        }
    }

}
