import { identifyService } from '../services/identify.service.js';

// This function handles the actual request for identity linking.
// It gets the user input, asks the service to process it, and sends back a result.
export const identifyController = async (req,res) => {
    const{ email, phoneNumber } =  req.body;

    // Basic validation (is record valid or not or filled correctly)

    if( !email && !phoneNumber){
      return res.status(400).json({
        message:"Either email or phoneNumber is required",
      });
    }

    try {
      // Indentify logic
      const result = await identifyController({email, phoneNumber});
      res.json(result);
      
    } catch (error) {
      console.log(`Error in indentifyController:`, error);
      res.status(500).json({message: 'server is not working!!!'});
      
    }
};