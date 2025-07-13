const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-shipping-estimate', async (req, res) => {
  try {
    const { toZip, weight } = req.body;

    // Log incoming request
    console.log('Incoming request:', { toZip, weight });

    const response = await axios.post('https://onlinetools.ups.com/rest/Rate', {
      UPSSecurity: {
        UsernameToken: {
          Username: process.env.UPS_USERNAME,
          Password: process.env.UPS_PASSWORD
        },
        ServiceAccessToken: {
          AccessLicenseNumber: process.env.UPS_ACCESS_KEY
        }
      },
      RateRequest: {
        Request: { RequestOption: 'Rate' },
        Shipment: {
          Shipper: {
            Address: {
              PostalCode: process.env.UPS_ORIGIN_ZIP,
              CountryCode: 'US'
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
            Code: '03', // UPS Ground
            Description: 'Ground'
          },
          Package: {
            PackagingType: {
              Code: '02',
              Description: 'Package'
            },
            PackageWeight: {
              UnitOfMeasurement: { Code: 'LBS' },
              Weight: weight.toString()
            }
          }
        }
      }
    });

    const charges = response.data?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue || null;

    // Log UPS response
    console.log('UPS returned charges:', charges);

    res.json({ cost: charges });
  } catch (error) {
    console.error('UPS API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get quote' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
