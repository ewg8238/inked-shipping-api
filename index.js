const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const getUpsToken = require('./getUpsToken');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/get-shipping-estimate', async (req, res) => {
  const { toZip, weight } = req.body;

  try {
    const token = await getUpsToken();
    if (!token) return res.status(500).json({ error: 'Auth failed' });

    const upsResponse = await axios.post(
      'https://wwwcie.ups.com/api/rating/v2205/Rate',
      {
        RateRequest: {
          Request: { TransactionReference: { CustomerContext: 'Rating Request' } },
          Shipment: {
            Shipper: {
              Address: {
                PostalCode: process.env.UPS_ORIGIN_ZIP,
                CountryCode: 'US',
              },
            },
            ShipTo: {
              Address: {
                PostalCode: toZip,
                CountryCode: 'US',
              },
            },
            Service: {
              Code: '03', // UPS Ground
            },
            Package: {
              PackagingType: { Code: '02' },
              PackageWeight: {
                UnitOfMeasurement: { Code: 'LBS' },
                Weight: weight.toString(),
              },
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          transId: Date.now().toString(),
          transactionSrc: 'InkedInGlassApp',
        },
      }
    );

    const totalCost = upsResponse.data?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue || null;
    res.json({ cost: totalCost });
  } catch (error) {
    console.error('UPS Rate error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch rate' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
