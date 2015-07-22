using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Snomed.DTOs
{
    [Route("/relationship/{ConceptId}")]
    public class RelationshipQuery
    {
        public Int64 ConceptId { get; set; }
    }

    public class RelationshipResponse
    {
        public string RelatedConcept { get; set; }
        public string Relationship { get; set; }

    }
}