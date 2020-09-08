
class License {

}

License.schema = {
  name: 'License',
  primaryKey: 'id',
  properties: {
    id: 'string',
    licenseId: 'string',
    licenseNumber: 'string',
    pinCode: 'string',
    callerName: 'string',
    isAccept: 'string'
  }
};

export default License;
