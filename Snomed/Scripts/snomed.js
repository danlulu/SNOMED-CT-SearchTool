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
                    { text: "Contains - Match Order", value: "Match Order" },
                    { text: "Contains - Any Order", value: "Any Order" },
                    { text: "Starts With", value: "Starts With" },
                    { text: "Ends With", value: "Ends With" }
        ];

        var conceptTypes = [
                    { text: "All Concept Types", value: "All Concept Types" },
                    { text: "Body Structure", value: "Body Structure" },
                    { text: "Disorder", value: "Disorder" },
                    { text: "Finding", value: "Finding" },
                    { text: "Morphologic Abnormality", value: "Morphologic Abnormality" },
                    { text: "Observable Entity", value: "Observable Entity" },
                    { text: "Occupation", value: "Occupation" },
                    { text: "Organism", value: "Organism" },
                    { text: "Procedure", value: "Procedure" },
                    { text: "Situation", value: "Situation" },
                    { text: "Substance", value: "Substance" }

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
            columns: [  
                { field: "Relationship", title: "Attribute", width: "300px" },
                { field: "RelatedConcept", title: "Related Concept" }
            ]
        });

        $("#frmSearch").submit(function (e) {
            e.preventDefault();
            searchTerm = $("#searchTerm").val();
            searchType = $("#searchType").data("kendoDropDownList").value();
            //searchOption = $('.btn-group > .btn.active').text().trim(); //does not work with IE8
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