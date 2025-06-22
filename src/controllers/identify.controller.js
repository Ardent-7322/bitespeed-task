import { identifyService } from '../services/identify.service.js';

// This function handles the actual request for identity linking.
// It gets the user input, asks the service to process it, and sends back a result.
export const identifyController = async (req, res) => {
  try {
    // Call the logic layer and get the response based on input
    const result = await identifyService(req.body);
    res.json(result); // Send response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' }); // In case something crashes
  }
};
