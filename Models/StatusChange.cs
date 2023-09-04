
namespace Database
{
	public partial class StatusChange
	{
		public int Id { get; set; }
		public System.DateTime? ChangeTime { get; set; }
		public string Status { get; set; }
		public string Note { get; set; }
		public string User { get; set; }
		public int Valid { get; set; }
		public int SortOrder { get; set; }
		public string LastModify { get; set; }
		public int? ApplicationFK { get; set; }
	}
}

