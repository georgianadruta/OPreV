/**
 * Class responsible for every tpe of chart(data representation).
 * Ex:  let barChart=new OPreVChart();
 */
class OPreVChart {
    tableInformation = {
        tableColumns: Array(String),
        dataset: Array(Object)
    }

    /**
     * The constructor.
     * It calls a HTTP GET request to get all the dataset.
     */
    constructor() {
        this.clearChart();
    }

    /**
     * Method responsible to call HTTP GET request for the dataset with filters from session storage.
     */
    refreshDataset() {
        getDatasetHTTPRequest().then(result => {
            this.tableInformation = result;
        }).catch(error => {
            console.log(error);
            alert("FAILED TO GET DATASET");
        });
    }

    /**
     * This function's purpose it to sort the data set ascending by default.
     * @param fieldName
     * @param asc
     */
    sortDataset(fieldName, asc = true) {
        if (this.tableInformation.dataset !== null) {
            this.tableInformation.dataset.sort((a, b) => {
                return ((asc === true) ? (a[fieldName].localeCompare(b[fieldName])) : (b[fieldName].localeCompare(a[fieldName])));
            });
        }
    }

    /**
     * Getter for the table column names.
     * @return {*|any[]} Array of Strings
     */
    getTableColumns() {
        return this.tableInformation.tableColumns;
    }

    /**
     * Getter for the table dataset.
     * @return {*|any[]} Array of JSON objects.
     */
    getDataset() {
        return this.tableInformation.dataset;
    }

    /**
     * This function's purpose is to clear table information.
     */
    clearChart() {
        this.tableInformation.tableColumns = [];
        this.tableInformation.dataset = [];
    }

    /**
     * This function's purpose is to remove data for a given country from tableInformation.
     * @param country
     */
    removeCountry(country) {
        for (let i = 0; i < this.tableInformation.dataset.length; i++) {
            let a = this.tableInformation.dataset[i];
            if (a.country === country) {
                this.tableInformation.dataset.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * This function's purpose is to remove data for a given year from tableInformation.
     * @param year
     */
    removeYear(year) {
        for (let i = 0; i < this.tableInformation.dataset.length; i++) {
            let a = this.tableInformation.dataset[i];
            if (a.year === year) {
                this.tableInformation.dataset.splice(i, 1);
                i--;
            }
        }
    }
}