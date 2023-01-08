import express from 'express';
import http from 'http';
import mongodb from 'mongodb';

const app = express();

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST=process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT=parseInt(process.env.VIDEO_STORAGE_PORT);
const DBHOST=process.env.DBHOST;
const DBNAME=process.env.DBNAME;

function main(){
    return mongodb.MongoClient.connect(DBHOST)
    .then(client => {
        const db = client.db(DBNAME);
        const videosCollection = db.collection("vidoes");

        app.get("/video",(req,res) => {
            const videoId =  new mongodb.ObjectID(req.query.id);
            videosCollection
            .findOne({ _id: videoId })
             .then(videoRecord => {
                    if (!videoRecord) {
                        res.sendStatus(404);
                        return; 
                    }

                    const forwardRequest = http.request(
                        {
                          host: VIDEO_STORAGE_HOST,
                          port: VIDEO_STORAGE_PORT,
                          path:'/video?path='+videoRecord.videoPath, 
                          method: 'GET',
                          headers: req.headers
                        },
                        forwardResponse => {
                            res.writeHeader(forwardResponse.statusCode,forwardResponse.headers);
                            forwardResponse.pipe(res);
                        }
                    );

                    req.pipe(forwardRequest);
           }).catch(error=>{
               console.error("Database query failed.");
               console.error(err && err.stack || err);
               res.sendStatus(500);
           })
        });

        app.listen(PORT, () => {
            console.log(`Microservice online.`);
       });
    });
}

main()
    .then(() => console.log("Microservice online."))
    .catch(err => {
        console.error("Microservice failed to start.");
        console.error(err && err.stack || err);
});

