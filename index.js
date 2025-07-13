Shipment: {
  Shipper: {
    Address: {
      PostalCode: process.env.UPS_ORIGIN_ZIP,
    }
  },
  ShipTo: {
    Address: {
      PostalCode: toZip,
      CountryCode: 'US'
    }
  },
  ShipFrom: {
    Address: {
      PostalCode: process.env.UPS_ORIGIN_ZIP,
      CountryCode: 'US'
    }
  },
  Service: {
    Code: '03',
    Description: 'Ground'
  },
  Package: {
    PackagingType: { Code: '02', Description: 'Package' },
    PackageWeight: {
      UnitOfMeasurement: { Code: 'LBS' },
      Weight: weight.toString()
    }
  }
}
