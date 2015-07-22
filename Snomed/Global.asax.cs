using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using ServiceStack.OrmLite.SqlServer;
using Snomed.Models;
using Snomed.Services;
using System;
using System.Web.Configuration;

namespace Snomed
{
    public class Global : System.Web.HttpApplication
    {
        public class SnomedAppHost : AppHostBase
        {
            public SnomedAppHost() : base("Snomed Web Services", typeof(ConceptService).Assembly) { }

            public override void Configure(Funq.Container container)
            {
                //var dbConnectionFactory = new OrmLiteConnectionFactory
                //        (WebConfigurationManager.ConnectionStrings["snomed"].ToString(),
                //        SqlServerOrmLiteDialectProvider.Instance);
                //container.Register<IDbConnectionFactory>(dbConnectionFactory);
                //using (var db = dbConnectionFactory.Open())
                //{
                //    db.CreateTable<Concept>();
                //}

                container.RegisterAutoWired<DataRepository>();
            }
        }

        protected void Application_Start(object sender, EventArgs e)
        {
            new SnomedAppHost().Init();
        }
    }
}