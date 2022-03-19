const { MongoClient } = require('mongodb');

async function main() {
    
    const uri = "mongodb+srv://update:demo@<your-cluster-url>/sample_airbnb?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();

        await findListingByName(client, "Infinite Views"); 
        await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8 });
        
        await findListingByName(client, "Infinite Views");

        await findListingByName(client, "Cozy Cottage");
        await upsertListingByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, bathrooms: 1 });
      
        await findListingByName(client, "Cozy Cottage");
        await upsertListingByName(client, "Cozy Cottage");
        await findListingByName(client, "Cozy Cottage");

        await updateAllListingsToHavePropertyType(client);
        await findListingByName(client, "Cozy Cottage");

    } finally {
        await client.close();
    }
}

main().catch(console.error);
async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}
async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing }, { $set: updatedListing }, { upsert: true });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}

async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({ property_type: { $exists: false } }, { $set: { property_type: "Unknown" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}