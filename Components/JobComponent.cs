using Microsoft.AspNetCore.Mvc;
using UmbracoCareer.Models;
using UmbracoCareer.Repository;

namespace UmbracoCareer.Components
{
    public class JobViewComponent : ViewComponent
    {
        private IJobRepository jobRepo;

        public JobViewComponent(IJobRepository jobRepo)
        {
            this.jobRepo = jobRepo;
        }

        public IViewComponentResult Invoke(int jobId)
        {
            var model = new JobViewModel();
            model.Job = jobRepo.Get(jobId);
            model.IsExpired = model.Job.Deadline < DateTime.Now.Date;
            model.Application = new ApplicationFormModel();
            model.Application.JobId = jobId;
            return View(model);
        }
    }
}
