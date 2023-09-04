using System.Collections.Specialized;

namespace DatabaseExtensionKitDemo.Helpers
{
    public static class Util
    {
        public static int RequestInt(IQueryCollection request, string fieldName)
        {
            var value = request[fieldName];
            var result = 0;
            if (!string.IsNullOrEmpty(value))
            {
                try
                {
                    result = int.Parse(value);

                }
                catch (Exception ex)
                {

                }
            }

            return result;
        }

        public static string RequestString(IQueryCollection request, string fieldName)
        {
            return request[fieldName];
        }

        public static bool RequestBool(IQueryCollection request, string fieldName)
        {
            var value = request[fieldName];
            var result = false;
            if (!string.IsNullOrEmpty(value))
            {
                try
                {
                    result = bool.Parse(value);

                }
                catch (Exception ex)
                {

                }
            }

            return result;
        }
    }
}
