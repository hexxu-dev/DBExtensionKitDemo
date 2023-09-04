
namespace Database
{
	public partial class Job
	{
		public int Id { get; set; }
		public string JobCategory { get; set; }
		public string JobType { get; set; }
		public string JobLocation { get; set; }
		public int? ActiveOnSite { get; set; }
		public System.DateTime? Deadline { get; set; }
		public string Title { get; set; }
		public int Valid { get; set; }
		public int SortOrder { get; set; }
		public string LastModify { get; set; }
		public string Description { get; set; }
		public string Requirements { get; set; }
		public string SalaryRange { get; set; }
		public int? Featured { get; set; }
	}
}

