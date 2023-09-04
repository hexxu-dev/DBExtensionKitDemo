using Database;
using System.ComponentModel.DataAnnotations;

namespace UmbracoCareer.Models
{
    public class JobViewModel
    {
        public Job Job { get; set; }
        public ApplicationFormModel Application { get; set; }
        public bool IsExpired { get; set; }

    }

    public class ApplicationFormModel
    {
        public int JobId { get; set; }
        public bool IsExpired { get; set; }
        [Display(Name = "Full Name")]
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        [Display(Name = "Cover Letter")]
        public string CoverLetter { get; set; }
        [Display(Name = "Upload CV/Resume")]
        public string Cv { get; set; }
        public int MediaId { get; set; }

    }
}
