using Database;
using DatabaseExtensionKitDemo.Helpers;
using DatabaseExtensionKitDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Logging;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Infrastructure.Persistence;
using Umbraco.Cms.Web.Website.Controllers;
using UmbracoCareer.Models;
using UmbracoCareer.Repository;

namespace UmbracoCareer.Controllers
{
    public class JobController : SurfaceController
	{
		private IJobRepository jobRepo;
		private IMediaService mediaService;
		private MediaFileManager mediaFileManager;
		private MediaUrlGeneratorCollection mediaUrlGeneratorCollection;
		private IShortStringHelper shortStringHelper;
		private IContentTypeBaseServiceProvider contentTypeBaseServiceProvider;
		public JobController(
			IUmbracoContextAccessor umbracoContextAccessor,
			IUmbracoDatabaseFactory databaseFactory,
			ServiceContext services,
			AppCaches appCaches,
			IProfilingLogger profilingLogger,
			IPublishedUrlProvider publishedUrlProvider,
			IJobRepository jobRepo, IMediaService mediaService, MediaFileManager mediaFileManager, MediaUrlGeneratorCollection mediaUrlGeneratorCollection, IShortStringHelper shortStringHelper, IContentTypeBaseServiceProvider contentTypeBaseServiceProvider)
			: base(umbracoContextAccessor, databaseFactory, services, appCaches, profilingLogger, publishedUrlProvider)
		{
			this.jobRepo = jobRepo;
			this.mediaService = mediaService;
			this.mediaFileManager = mediaFileManager;
			this.mediaUrlGeneratorCollection = mediaUrlGeneratorCollection;
			this.shortStringHelper = shortStringHelper;
			this.contentTypeBaseServiceProvider = contentTypeBaseServiceProvider;
		}

		[HttpPost]
		public IActionResult Apply(JobViewModel model)
		{
			var application = new Application
			{
				Valid = 1,
				FullName = model.Application.Name,
				Email = model.Application.Email,
				Phone = model.Application.Phone,
				CoverLetter = model.Application.CoverLetter,
				ApplicationStatus = ApplicationStatus.Submitted,
				Job = model.Application.JobId,
				ApplicationDate = DateTime.Now
			};

			var media = mediaService.GetById(model.Application.MediaId);
			if (media != null)
			{
				var mediaUrl = media.GetUrl("umbracoFile", mediaUrlGeneratorCollection);
				application.CVResume = string.Format("<a href=\"{0}\">{1}</a>", mediaUrl, media.Name);
			}

            var applicationId = jobRepo.SaveApplication(application).Id;

			var appStatus = new StatusChange
			{
				ChangeTime = DateTime.Now,
				Status = ApplicationStatus.Submitted,
				Valid = 1,
				ApplicationFK = applicationId
			};

			jobRepo.SaveStatusChange(appStatus);

			var queryParam = QueryString.Create("id", model.Application.JobId.ToString()).Add("success","1");

			return RedirectToCurrentUmbracoPage(queryParam);

		}

        [HttpPost]
        public IActionResult Upload()
        {
            var files = Request.Form.Files;
			var mediaId = 0;

            if (files.Count > 0)
            {
                var cvFile = files[0];

                using (var ms = new MemoryStream())
                {
                    cvFile.CopyTo(ms);
                    var fileBytes = ms.ToArray();
                    string s = Convert.ToBase64String(fileBytes);

                    int mediaRootId = JobConstants.CsvFolder;
                    var filename = cvFile.FileName;
                    var mediaType = Constants.Conventions.MediaTypes.File;
                    var media = mediaService.CreateMedia(filename, mediaRootId, mediaType);
                    media.SetValue(mediaFileManager, mediaUrlGeneratorCollection, shortStringHelper, contentTypeBaseServiceProvider, Constants.Conventions.Media.File, filename, ms);

                    mediaService.Save(media);
					mediaId = media.Id;

                }
            }

            return Ok(mediaId);

        }

        public ActionResult JobList()
		{
			var search = new JobSearch
			{
				Param = Util.RequestString(Request.Query, "param"),
				Category = Util.RequestString(Request.Query, "cat"),
				Type = Util.RequestString(Request.Query, "type"),
				Location = Util.RequestString(Request.Query, "loc"),
				Page = Util.RequestInt(Request.Query, "page"),
				Limit = Util.RequestInt(Request.Query, "limit")
            };

			var result = new JobResult
			{
				Items = jobRepo.GetAll(search),
				Total = jobRepo.CountRecords(search),
				Limit = search.Limit,
				CurrentPage = search.Page,
				ListView = Util.RequestBool(Request.Query, "list")
            };
            return PartialView("~/Views/Partials/JobList.cshtml", result);
		}

    }
}
