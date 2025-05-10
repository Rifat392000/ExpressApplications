const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

// MongoClient setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Define collections
    const jobsCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_1);
    const jobApplicationCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_2);

    // ========================
    //         JOB APIs
    // ========================

    // GET all jobs or jobs posted by a specific HR email
    app.get('/jobs', async (req, res) => {
      const email = req.query.email;
      const query = email ? { hr_email: email } : {};
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    });

    // GET a single job by ID
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id;
      const result = await jobsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // POST a new job
    app.post('/jobs', async (req, res) => {
      const newJob = req.body;
      const result = await jobsCollection.insertOne(newJob);
      res.send(result);
    });

    // ====================================
    //     JOB APPLICATION APIs
    // ====================================

    // GET job applications for a specific applicant email, also enrich with job info
    app.get('/job-application', async (req, res) => {
      const email = req.query.email;
      const query = { applicant_email: email };
      const applications = await jobApplicationCollection.find(query).toArray();

      // Add related job details to each application
      for (const application of applications) {
        const job = await jobsCollection.findOne({ _id: new ObjectId(application.job_id) });
        if (job) {
          application.title = job.title;
          application.location = job.location;
          application.company = job.company;
          application.company_logo = job.company_logo;
        }
      }

      res.send(applications);
    });

    // GET all applications for a specific job by job_id
    app.get('/job-applications/jobs/:job_id', async (req, res) => {
      const jobId = req.params.job_id;
      const result = await jobApplicationCollection.find({ job_id: jobId }).toArray();
      res.send(result);
    });

    // POST a new job application and update the application count in the corresponding job
    app.post('/job-applications', async (req, res) => {
      const application = req.body;
      const result = await jobApplicationCollection.insertOne(application);

      // Update application count for the related job
      const job = await jobsCollection.findOne({ _id: new ObjectId(application.job_id) });
      const newCount = job?.applicationCount ? job.applicationCount + 1 : 1;

      await jobsCollection.updateOne(
        { _id: new ObjectId(application.job_id) },
        { $set: { applicationCount: newCount } }
      );

      res.send(result);
    });

    // PATCH: Update status of a job application (e.g., accepted, rejected)
    app.patch('/job-applications/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const result = await jobApplicationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: data.status } }
      );
      res.send(result);
    });

  } finally {
    // You can close the DB client here if needed
  }
}

// Start DB connection and server
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send('Job is falling from the sky');
});

// Start server
app.listen(port, () => {
  console.log(`System is running at: ${port}`);
});
