const { MongoClient } = require('mongodb');

async function main() {
    
    const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/sample_airbnb?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {

        await client.connect();


        await printIfListingExists(client, "Cozy Cottage");
        await deleteListingByName(client, "Cozy Cottage");
        await printIfListingExists(client, "Cozy Cottage");

        await printIfListingExists(client, "Ribeira Charming Duplex");
        await printIfListingExists(client, "Horto flat with small garden");
        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));
        await printIfListingExists(client, "Ribeira Charming Duplex");
        await printIfListingExists(client, "Horto flat with small garden");

    } finally {        await client.close();
    }
}

main().catch(console.error);

async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

    async function deleteListingsScrapedBeforeDate(client, date) {const result = await client.db("sample_airbnb").collection("listingsAndReviews").deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}
