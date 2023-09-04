using DatabaseExtensionKit.Models;
using Umbraco.Cms.Core.Models.ContentEditing;

namespace UmbracoCareer.Handlers
{
    public static class HandlerHelper
    {
        public static void setListForProperty(DocumentTypeDisplay model, string propertyName, List<string> listValues)
        {
            foreach (var prop in model.Groups.FirstOrDefault().Properties)
            {
                if (prop.Alias == propertyName)
                {
                    var items = new Dictionary<string, ValueItem>();

                    for (int i = 1; i <= listValues.Count; i++)
                    {
                        items[i.ToString()] = new ValueItem { SortOrder = i, Value = listValues[i - 1] };
                    }

                    prop.Config["items"] = items;
                }
            }
        }
    }
}
