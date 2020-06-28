import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url
  app.get('/filteredimage', async (req: Request, res: Response) => {
    const image_url = req.query.image_url;

    if (!image_url) {
      return res.status(400).send({ message: 'Please provide an image url.' });
    }
    
    try {
      const filteredPath = await filterImageFromURL(image_url);
  
      res.sendFile(filteredPath, (err) => {
        if (err) {
          res.status(400).send({ message: 'Error transmitting file.' });
        }
        deleteLocalFiles([ filteredPath ]);
      })
    } catch (error) {
      res.status(422).send({ message: 'Please provide a url to a valid image.' });
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();