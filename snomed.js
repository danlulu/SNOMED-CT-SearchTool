(function($) {
    $(document).ready(function () {
        var resizeDropDown = function (e) {
            var $dropDown = $(e.sender.element),
                dataWidth = $dropDown.data("kendoDropDownList").list.width(),
                listWidth = dataWidth + 20,
                containerWidth = listWidth + 6;

            // Set widths to the new values
            $dropDown.data("kendoDropDownList").list.width(listWidth);
            $dropDown.closest(".k-widget").width(containerWidth);
        }

        var searchTypes = [
                    { text: "Contains - Words in Exact Order", value: "1" },
                    { text: "Contains - Words in Any Order", value: "2" },
                    { text: "Starts With Search Term", value: "3" },
                    { text: "Ends With Search Term", value: "4" }                    
        ];

        var conceptTypes = [
                    { text: "All Concept Types", value: "All Concept Types" },
                    { text: "Procedure", value: "Procedure" },
                    { text: "Disorder", value: "Disorder" },
                    { text: "Finding", value: "Finding" },
                    { text: "Body Structure", value: "5" },
                    { text: "Organism", value: "6" },
                    { text: "Morphologic Abnormality", value: "7" },
                    { text: "Substance", value: "8" },
                    { text: "Occupation", value: "9" },
                    { text: "Observable Entity", value: "Observable Entity" },
                    { text: "Situation", value: "Situation" }

        ];

        $("#searchType").kendoDropDownList({
            dataBound: resizeDropDown,
            dataSource: searchTypes,
            dataTextField: "text",
            dataValueField: "value"
        });

        $("#conceptType").kendoDropDownList({
            dataBound: resizeDropDown,
            dataSource: conceptTypes,
            dataTextField: "text",
            dataValueField: "value"
        });

        $("#results").hide();
        $("#relationships").hide();

        var baseUrl = ".";   //window.location.protocol + "//" + window.location.host;
        var searchTerm = "";
        var searchType = "";
        var searchOption = "";
        var conceptType = "";
        var conceptId = "";

        var query = {};

        var conceptsDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function (options) {
                        //var url = baseUrl + "/concept/" + searchTerm + "/" + searchType + "/" + searchOption + "?format=json";
                        var url = baseUrl + "/concept?format=json";
                        return url;
                    },
                    data: function (options) {
                        return query;
                    }
                }
            }
            //, pageSize: 5
        });

        $("#gridConcepts").kendoGrid({
            height: 255,
            dataSource: conceptsDataSource,
            autoBind: false,
            columns: [  { field: "ConceptId", title: "Concept Identifier", width: "150px" },
                        { field: "FullySpecifiedName", title: "Fully-Specified Name" },
                        { field: "PreferredTerm", title: "Preferred Term" }],
            change: onChange,
            sortable: true,
            //pageable: true,
            selectable: "row"
        });

        var relationshipsDataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: function (options) {
                        var url = baseUrl + "/relationship/" + conceptId + "?format=json";
                        return url;
                    }
                }
            }
        });

        $("#gridRelationships").kendoGrid({
            dataSource: relationshipsDataSource,
            autoBind: false,
            columns: [  //{ field: "Concept1", title: "Concept 1" },
                        { field: "Relationship", title: "Attribute", width: "300px" },
                        { field: "RelatedConcept", title: "Related Concept" }]
        });

        $("#frmSearch").submit(function (e) {
            e.preventDefault();
            searchTerm = $("#searchTerm").val();
            //searchOption = $('.btn-group > .btn.active').text().trim(); //does not work with IE8
            searchType = $("#searchType").data("kendoDropDownList").value();
            searchOption = $('.btn-group > .btn.active').text();
            searchOption = $.trim(searchOption);
            conceptType = $("#conceptType").data("kendoDropDownList").value();

            query = {
                SearchTerm: searchTerm,
                SearchType: searchType,
                SearchOption: searchOption,
                ConceptType: conceptType
            }

            $("#gridConcepts").data("kendoGrid").dataSource.read();
            $("#gridRelationships").data('kendoGrid').dataSource.data([]);
            $("#results").show();
            $("#relationships").show();
        });

        function onChange(arg) {
            conceptId = this.select()[0].cells[0].innerText;
            //console.log(conceptId); //does not work with IE8
            $("#gridRelationships").data("kendoGrid").dataSource.read();
        }

        $("#tooltip1").kendoTooltip({
            content: "Fully Specified Names",
            position: "top"
        });
        $("#tooltip2").kendoTooltip({
            content: "Preferred Terms",
            position: "top"
        });
        $("#tooltip3").kendoTooltip({
            content: "Synonyms",
            position: "top"
        });
        $("#tooltip4").kendoTooltip({
            content: "All Terms",
            position: "top"
        });
    });
})(jQuery);