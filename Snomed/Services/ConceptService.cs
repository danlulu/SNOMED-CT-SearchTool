using ServiceStack;
using Snomed.DTOs;

namespace Snomed.Services
{
    public class ConceptService : Service
    {
        public DataRepository dr { get; set; }

        public object Any(ConceptQuery query)
        {
            return dr.GetConcepts(query);
        }
    }
}