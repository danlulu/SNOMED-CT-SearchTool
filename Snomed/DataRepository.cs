using ServiceStack.Data;
using ServiceStack.OrmLite;
using Snomed.DTOs;
using Snomed.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Configuration;

namespace Snomed
{
    public class DataRepository
    {
        //public IDbConnectionFactory DbConnectionFactory { get; set; }

        public List<ConceptResponse> GetConcepts(ConceptQuery query)
        {
            var responses = new List<ConceptResponse>();

            String ConnString = WebConfigurationManager.ConnectionStrings["SNOMED"].ToString();
            SqlConnection connection = new SqlConnection(ConnString);

            string SPName = "";
            switch (query.SearchOption)
            {
                case "FSNs":
                    SPName = "SearchFullySpecifiedNames";
                    break;
                case "PTs":
                    SPName = "SearchPreferredTerms";
                    break;
                case "Syns":
                    SPName = "SearchSynonyms";
                    break;
                case "All":
                    SPName = "SearchAll";
                    break;
            }

            switch (query.SearchType)
            {
                case "Match Order":
                    query.SearchType = "1";
                    break;
                case "Any Order":
                    query.SearchType = "2";
                    break;
                case "Starts With":
                    query.SearchType = "3";
                    break;
                case "Ends With":
                    query.SearchType = "4";
                    break;
            }
   
            SqlCommand cmd = new SqlCommand(SPName);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@SearchType", SqlDbType.VarChar).Value = query.SearchType;
            cmd.Parameters.Add("@ConceptType", SqlDbType.VarChar).Value = query.ConceptType;
            cmd.Parameters.Add("@SearchString", SqlDbType.VarChar).Value = query.SearchTerm;
            cmd.Connection = connection;
            try
            {
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        responses.Add(new ConceptResponse()
                        {
                            ConceptId = reader.GetInt64(reader.GetOrdinal("ConceptId")),
                            FullySpecifiedName = reader.GetString(reader.GetOrdinal("FullySpecifiedName")),
                            PreferredTerm = reader.GetString(reader.GetOrdinal("PreferredTerm"))
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
                connection.Dispose();
            }
            return responses;
        }

        public List<RelationshipResponse> GetRelationships(Int64 ConceptId)
        {
            var responses = new List<RelationshipResponse>();

            String ConnString = WebConfigurationManager.ConnectionStrings["SNOMED"].ToString();
            SqlConnection connection = new SqlConnection(ConnString);

            SqlCommand cmd = new SqlCommand("SearchRelationships");
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@ConceptId", SqlDbType.BigInt).Value = ConceptId;
            cmd.Connection = connection;
            try
            {
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        responses.Add(new RelationshipResponse()
                        {
                            //Concept1 = reader.GetString(reader.GetOrdinal("Concept1")),
                            Relationship = reader.GetString(reader.GetOrdinal("Relationship")),
                            RelatedConcept = reader.GetString(reader.GetOrdinal("Concept2"))
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
                connection.Dispose();
            }
            return responses;
        }

        //public List<Concept> GetAllConcepts()
        //{
        //    using (var db = DbConnectionFactory.OpenDbConnection())
        //    {
        //        return db.Select<Concept>();
        //    }
        //}

        //public Concept GetConceptById(Int64 id)
        //{
        //    using (var db = DbConnectionFactory.OpenDbConnection())
        //    {
        //        return db.Select<Concept>(c => c.ConceptId == id).FirstOrDefault();
        //    }
        //}
    }
}