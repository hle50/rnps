
class PendingReport {

}

PendingReport.schema = {
  name: 'PendingReport',
  primaryKey: 'id',
  properties: {
    id: 'string',
    data: 'string',
    status: 'int',
    displayFields: 'string',
    submitDate: 'string'
  }
};

export default PendingReport;
