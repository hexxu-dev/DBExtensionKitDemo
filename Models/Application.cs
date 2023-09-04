
namespace Database
{
	public partial class Application
	{
		public int Id { get; set; }
		public int? Job { get; set; }
		public string FullName { get; set; }
		public string Email { get; set; }
		public string Phone { get; set; }
		public int Valid { get; set; }
		public int SortOrder { get; set; }
		public string LastModify { get; set; }
		public string CoverLetter { get; set; }
		public string CVResume { get; set; }
		public System.DateTime? ApplicationDate { get; set; }
		public string ApplicationStatus { get; set; }
		public string Note { get; set; }
		public int? Bookmarked { get; set; }
	}
}

