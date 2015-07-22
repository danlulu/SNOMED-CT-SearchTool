using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Snomed.DTOs
{
    [Api("Valid SearchOption value: 'FSNs', 'PTs', 'Syns' and 'All'. For other options, use dropdown text values.")]
    [Route("/concept")]
    public class ConceptQuery
    {
        public string SearchTerm { get; set; }
        public string SearchType { get; set; }
        public string SearchOption { get; set; }
        public string ConceptType { get; set; }
    }

    public class ConceptResponse
    {
        public Int64 ConceptId { get; set; }
        public string FullySpecifiedName { get; set; }
        public string PreferredTerm { get; set; }
        public string Synonym { get; set; }
    }
}