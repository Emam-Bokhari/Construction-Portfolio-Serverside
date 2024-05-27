const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());


// database 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USERS_DB}:${process.env.PASS_DB}@cluster0.kndeci6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();

        //  database collection
        const database = client.db("construction-portfolio");
        const servicesCollection = database.collection("services");
        const teamMembersCollection = database.collection("teamMembers");
        const projectsCollection = database.collection("projects");
        const testimonialsCollection = database.collection("testimonials");
        const blogsCollection = database.collection("blogs");

        // get :: show all services
        app.get("/api/v1/all-services", async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result);
        });

        // get :: show all team members
        app.get("/api/v1/show-all-team-members", async (req, res) => {
            const result = await teamMembersCollection.find().toArray();
            res.send(result);
        });

        // get :: show all projects
        app.get("/api/v1/show-all-projects", async (req, res) => {
            const result = await projectsCollection.find().toArray();
            res.send(result);
        });

        // get :: show all testimonials
        app.get("/api/v1/show-all-testimonials", async (req, res) => {
            const result = await testimonialsCollection.find().toArray();
            res.send(result);
        })

        // post :: create service
        app.post("/api/v1/crete-service", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.send(result);
        });

        // post :: create team member
        app.post("/api/v1/create-team-member", async (req, res) => {
            const teamMember = req.body;
            const result = await teamMembersCollection.insertOne(teamMember);
            res.send(result);
        });

        // post :: create project
        app.post("/api/v1/create-project", async (req, res) => {
            const project = req.body;
            const result = await projectsCollection.insertOne(project);
            res.send(result);
        });

        // post :: create testimonials
        app.post("/api/v1/create-testimonials", async (req, res) => {
            const testimonials = req.body;
            const result = await testimonialsCollection.insertOne(testimonials);
            res.send(result);
        })

        // patch :: update service
        app.patch("/api/v1/update-service/:serviceId", async (req, res) => {
            const serviceData = req.body;
            const serviceId = req.params.serviceId;
            const query = { _id: new ObjectId(serviceId) };
            const updateService = {
                $set: {
                    image: serviceData.image,
                    serviceName: serviceData.serviceName,
                    serviceDescription: serviceData.serviceDescription,
                    serviceBenefitsTitle: serviceData.serviceBenefitsTitle,
                    serviceBenefitsDescription: serviceData.serviceBenefitsDescription
                }
            }
            const result = await servicesCollection.updateOne(query, updateService);
            res.send(updateService);
        });

        // patch :: update team member
        app.patch("/api/v1/update-team-member/:teamMemberId", async (req, res) => {
            const teamMemberId = req.params.teamMemberId;
            const teamMemberData = req.body;
            const query = { _id: new ObjectId(teamMemberId) };
            const updateTeamMember = {
                $set: {
                    image: teamMemberData.image,
                    name: teamMemberData.name,
                    designation: teamMemberData.designation,
                    facebookSocialLink: teamMemberData.facebookSocialLink,
                    twitterSocialLink: teamMemberData.twitterSocialLink,
                    instagramSocialLink: teamMemberData.instagramSocialLink,
                    linkedinSocialLink: teamMemberData.linkedinSocialLink,
                }
            }
            const result = await teamMembersCollection.updateOne(query, updateTeamMember);
            res.send(result);
        });

        // patch :: update project
        app.patch("/api/v1/update-project/:projectId", async (req, res) => {
            const projectId = req.params.projectId;
            const projectData = req.body;
            const query = { _id: new ObjectId(projectId) };
            const updateProject = {
                $set: {
                    image: projectData.image
                }
            }
            const result = await projectsCollection.updateOne(query, updateProject);
            res.send(result);
        });

        // delete :: delete service
        app.delete("/api/v1/delete-service/:serviceId", async (req, res) => {
            const serviceId = req.params.serviceId;
            const query = { _id: new ObjectId(serviceId) };
            const result = await servicesCollection.deleteOne(query);
            res.send(result);
        });

        // delete :: delete team member
        app.delete("/api/v1/delete-team-member/:teamMemberId", async (req, res) => {
            const teamMemberId = req.params.teamMemberId;
            const query = { _id: new ObjectId(teamMemberId) };
            const result = await teamMembersCollection.deleteOne(query);
            res.send(result);
        });

        // delete :: delete project
        app.delete("/api/v1/delete-project/:projectId", async (req, res) => {
            const projectId = req.params.projectId;
            const query = { _id: new ObjectId(projectId) };
            const result = await projectsCollection.deleteOne(query);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



// health
app.get("/health", (req, res) => {
    res.send("Server is running...");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});