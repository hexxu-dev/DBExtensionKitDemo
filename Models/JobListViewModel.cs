using Database;

namespace UmbracoCareer.Models
{
    public class JobListViewModel
    {
        public List<Job> JobList { get; set;}
        public List<string> JobCategories { get; set;} 
        public List<string> JobLocations { get; set; }
        public List<string> JobTypes { get; set; }
        public bool ListView { get; set; }
        public int NumPerPage { get; set; }

    }

    public class JobSearch
    {
        public string Param { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public string Location { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
    }

    public class JobResult
    {
        public List<Job> Items { get; set; }
        public int Total { get; set; }
        public int Limit { get; set; }
        public int CurrentPage { get; set; }
        public bool ListView {get;set;}
    }
}
