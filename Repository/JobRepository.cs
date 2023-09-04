using Database;
using NPoco;
using Polly;
using Umbraco.Cms.Infrastructure.Scoping;
using UmbracoCareer.Models;

namespace UmbracoCareer.Repository
{
    public class JobRepository : IJobRepository
    {
        private IScopeProvider scopeProvider;

        public JobRepository(IScopeProvider scopeProvider)
        {
            this.scopeProvider = scopeProvider;
        }

        public int CountRecords(JobSearch search)
        {
            using (var scope = scopeProvider.CreateScope())
            {
                var countQuery = Sql.Builder.Append("select count (id) from Job where Valid=1 and activeOnSite=1");
                setSearchConditions(search, countQuery);
                var totalRecords = scope.Database.SingleOrDefault<int>(countQuery);
                scope.Complete();
                return totalRecords;
            }
        }

        public Job Get(int id)
        {
            using (var scope = scopeProvider.CreateScope())
            {
                var result = scope.Database.SingleOrDefault<Job>("select * from Job where id=@0", id);
                scope.Complete();
                return result;
            }
        }

        public List<Job> GetAll(JobSearch search)
        {
            using (var scope = scopeProvider.CreateScope())
            {
                var query = Sql.Builder.Append("select * from Job where Valid=1 and activeOnSite=1");
                setSearchConditions(search, query);

                var limit = search.Limit;
                var offset = (search.Page - 1) * limit;

                query.Append(" order by Featured desc, Id desc offset " + offset +" rows fetch next " + limit + " rows only");
                var result = scope.Database.Fetch<Job>(query);
                scope.Complete();
                return result;
            }

        }

        public StatusChange GetLastApplicationStatus(int applicationId)
        {
            using (var scope = scopeProvider.CreateScope())
            {
                var result = scope.Database.SingleOrDefault<StatusChange>("select top 1 * from StatusChange where Valid=1 and applicationFK=@0 order by id desc", applicationId);
                scope.Complete();
                return result;
            }
        }

        public Application SaveApplication(Application item)
        {
            using (var scope = scopeProvider.CreateScope())
            {
                scope.Database.Insert(item);
                scope.Complete();

                return item;
            };
        }

        public void SaveStatusChange(StatusChange item)
        {
            using (var scope = scopeProvider.CreateScope())
            {
                scope.Database.Save(item);
                scope.Complete();
            }
        }

        private void setSearchConditions(JobSearch search, Sql query)
        {
            if (!string.IsNullOrEmpty(search.Type))
            {
                query.Append(" and JobType = @0", search.Type);
            }


            if (!string.IsNullOrEmpty(search.Category))
            {
                query.Append(" and JobCategory = @0", search.Category);
            }


            if (!string.IsNullOrEmpty(search.Location))
            {
                query.Append(" and JobLocation = @0", search.Location);
            }

            if (!string.IsNullOrEmpty(search.Param))
            {
                query.Append(" and (Title like @0  or Description like @0)", string.Format("%{0}%", search.Param));
            }
        }
    }
}

