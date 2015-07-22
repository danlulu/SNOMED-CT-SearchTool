using ServiceStack;
using Snomed.DTOs;

namespace Snomed.Services
{
    public class RelationshipService : Service
    {
        public DataRepository dr { get; set; }

        public object Any(RelationshipQuery query)
        {
            return dr.GetRelationships(query.ConceptId);
        }
    }
}