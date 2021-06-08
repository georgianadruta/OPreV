/**
 * Class responsible for every tpe of chart(data representation).
 * Ex:  let barChart=new OPreVChart();
 */
class OPreVChart {
    tableInformation = {
        tableColumns: Array(String),
        dataset: Array(Object),
        filters: {
            mass: String,
            years: Array(String),
            countries: Array(String)
        }
    }

    /**
     * The constructor.
     * It calls a HTTP GET request to get all the dataset.
     */
    constructor() {
        window.sessionStorage.setItem("dataset", "eurostat"); //by default
        getDatasetHTTPRequest().then(result => {
            this.tableInformation = result;
        }).catch(error => {
            console.log(error);
            alert("FAILED TO GET DATASET");
        });
    }

    /**
     * Method responsible to call HTTP GET request for the dataset.
     * Filters may be specified as parameter. If not, it will simply get all the dataset from the server.
     * @param filters the filters ||    TODO decide how this parameter will look
     */
    refreshTableInformationWithFilters(filters = null) {
        if (filters == null)
            getDatasetHTTPRequest().then(result => {
                tableInformation = result;
            }).catch(error => {
                console.log(error);
                alert("FAILED TO GET DATASET");
            });
        else {
            setCookie("filters", filters)
            getDatasetHTTPRequest().then(result => {
                tableInformation = result;
                deleteCookie("filters");
            }).catch(error => {
                console.log(error);
                alert("FAILED TO GET DATASET");
                deleteCookie("filters");
            });
        }
    }


    /**
     * This function's purpose is to refresh this.filters based on what the user was clicked.
     */
    refreshFilters() {
        let bodyMass = '', years = [], countries = [];

        let bodyMassContainer = document.getElementsByName('bodyMassRadioButton');
        for (let i = 0; i < bodyMassContainer.length; i++) {
            if (bodyMassContainer[i].checked) {
                bodyMass = bodyMassContainer[i].value;
                break;
            }
        }

        let yearsContainer = document.getElementsByName('years');
        for (let i = 0; i < yearsContainer.length; i++) {
            if (yearsContainer[i].checked) {
                years.push(yearsContainer[i].value);
            }
        }

        let countriesContainer = document.getElementsByName('countries');
        for (let i = 0; i < countriesContainer.length; i++) {
            if (countriesContainer[i].checked) {
                countries.push(countriesContainer[i].value);
            }
        }

        this.tableInformation.filters = {
            mass: bodyMass,
            years: years,
            countries: countries
        };
    }

    /**
     * Getter for the table column names.
     * @return {*|any[]} Array of Strings
     */
    getTableColumns() {
        return tableInformation.tableColumns;
    }

    /**
     * Getter for the table dataset.
     * @return {*|any[]} Array of JSON objects.
     */
    getDataset() {
        return tableInformation.dataset;
    }

    /**
     * Setter for the table column names.
     */
    setTableColumns(tableColumns) {
        tableInformation.tableColumns = tableColumns;
    }

    /**
     * Setter for the table dataset.
     */
    setDataset(dataset) {
        tableInformation.dataset = dataset;
    }


    sort() {
        window.addEventListener("load", function () {
            const tempLabels = this.getDatasetLabels();
            const tempData = this.getDatasetData();

            let tempDataset = Array();
            for (let i = 0; i < tempLabels.length; i++) {
                tempDataset.push(
                    {
                        "country": tempLabels[i],
                        "first": tempData[0][i],
                        "second": tempData[1][i],
                        "third": tempData[2][i]
                    });
            }

            const sortByDropdown = document.querySelector(".sort-by");
            const sortOrderDropdown = document.querySelector(".sort-order");

            const ascendingSort = (sortByValue) => {
                return tempDataset.sort((a, b) => {
                    if (a[sortByValue] < b[sortByValue]) return -1;
                    if (a[sortByValue] > b[sortByValue]) return 1;
                    return 0;
                });
            };

            const descendingSort = (sortByValue) => {
                return tempDataset.sort((a, b) => {
                    if (a[sortByValue] < b[sortByValue]) return 1;
                    if (a[sortByValue] > b[sortByValue]) return -1;
                    return 0;
                });
            };

            sortByDropdown.addEventListener("change", () => {
                const sortByValue = sortByDropdown.value; // country or year value
                const sortOrderValue = sortOrderDropdown.value; // asc or desc value

                const sorted =
                    sortOrderValue === "desc"
                        ? descendingSort(sortByValue)
                        : ascendingSort(sortByValue);

                let arrayLabels = Array();
                let firstData = Array();
                let secondData = Array();
                let thirdData = Array();
                for (let i = 0; i < sorted.length; i++) {
                    arrayLabels.push(sorted[i].country);
                    firstData.push(sorted[i].first);
                    secondData.push(sorted[i].second);
                    thirdData.push(sorted[i].third);
                }
                setDatasetLabels(arrayLabels);
                let finalData = Array();
                finalData.push(firstData);
                finalData.push(secondData);
                finalData.push(thirdData);
                setDatasetData(finalData);
                let table = new TableChart();
                table.refreshTableData().then();
                table.generateTable();

            });

            sortOrderDropdown.addEventListener("change", () => {
                const event = new Event("change");
                const sortByValue = sortByDropdown.value;
                if (sortByValue) {
                    sortByDropdown.dispatchEvent(event);
                }
            });
        });
    }
}

let dataset = {
    labels: null,
    data: Array()
}

/**
 * Getter for dataset labels
 * @returns {string[]}
 */
function getDatasetLabels() {
    //TODO GET LABELS BY HTTP REQUEST
    return dataset.labels;
}

/**
 * Getter for dataset object
 * @returns {any[]} dataset array
 */
function getDatasetData() {
    //TODO GET DATASET BY HTTP REQUEST
    return dataset.data;
}

/**
 * Setter for dataset.labels object.
 */
function setDatasetLabels(newLabels) {
    dataset.labels = newLabels;
}

/**
 * Setter for dataset.data object.
 */
function setDatasetData(newData) {
    dataset.data = newData;
}
