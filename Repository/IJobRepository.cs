using Database;
using UmbracoCareer.Models;

namespace UmbracoCareer.Repository
{
	public interface IJobRepository
	{
		List<Job> GetAll(JobSearch search);
        int CountRecords(JobSearch search);
        Job Get(int id);
		StatusChange GetLastApplicationStatus(int applicationId);
		void SaveStatusChange(StatusChange item);
		Application SaveApplication(Application item);



    }
}
