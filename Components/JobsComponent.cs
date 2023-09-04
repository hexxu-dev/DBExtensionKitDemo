using DatabaseExtensionKitDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Services;
using UmbracoCareer.Models;
using UmbracoCareer.Repository;

namespace UmbracoCareer.Components
{
    public class JobsViewComponent : ViewComponent
    {
        private IDataTypeService dtService;

        public JobsViewComponent(IDataTypeService dtService)
        {
            this.dtService = dtService;
        }

        public IViewComponentResult Invoke(JobListViewModel model)
        {
            model.JobCategories = getListValues(UmbracoList.JobCategories);
            model.JobTypes = getListValues(UmbracoList.JobTypes);
            model.JobLocations = getListValues(UmbracoList.JobLocations);

            return View(model);
        }

        private List<string> getListValues(int typeId)
        {
            var result = new List<string>();
            var dt = dtService.GetDataType(typeId);
            if (dt != null && dt.Configuration != null)
            {
                var config = (DropDownFlexibleConfiguration)dt.Configuration;
                result = config.Items.Select(x => x.Value).ToList();
            }
            return result;
        }
    }
}
