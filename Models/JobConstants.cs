namespace DatabaseExtensionKitDemo.Models
{
    public static class JobConstants
    {
        public const int CsvFolder = 1075;
    }

    public static class ApplicationStatus
    {
        public const string Submitted = "Submitted";
        public const string Shortlisted = "Shortlisted";
        public const string Interviewed = "Interviewed";
        public const string Rejected = "Rejected";
        public const string Employeed = "Employeed";
    }

    public static class ObjectTypes
    {
        public const string Application = "Application";
        public const string Job = "Job";
    }

    public static class Properties
    {
        public const string ApplicationStatus = "applicationStatus";
        public const string Note = "note";
        public const string Bookmarked = "bookmarked";
    }

    public static class UserGroups
    {
        public const string Interviewer = "interviewer";
        public const string Recruiter = "recruiter";
    }

    public static class UmbracoList
    {
        public const int JobCategories = 1059;
        public const int JobTypes = 1060;
        public const int JobLocations = 1061;
    }
}
