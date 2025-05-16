const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//  === Access Token key generate ===
//node
//require('crypto').randomBytes(64).toString('hex')



// === Middleware ===
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// === Custom Logger Middleware ===
const logger = (req, res, next) => {
    console.log('inside the logger');
    next();
};

// === JWT Token Verification Middleware ===
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    if (!token) {
        return res.status(401).send({ message: 'unauthorized access' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' });
        }
        req.user = decoded;
        next();
    });
};

// === MongoDB Setup ===
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// === Main App Logic ===
async function run() {
    try {
        // === MongoDB Collections ===
        const jobsCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_1);
        const jobApplicationCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_2);

        // === Auth Route ===
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            }).send({ success: true });
        });

        // === Job Routes ===
        app.get('/jobs', logger, async (req, res) => {
            const email = req.query.email;
            const query = email ? { hr_email: email } : {};
            const jobs = await jobsCollection.find(query).toArray();
            res.send(jobs);
        });

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
            res.send(job);
        });

        app.post('/jobs', async (req, res) => {
            const newJob = req.body;
            const result = await jobsCollection.insertOne(newJob);
            res.send(result);
        });

        // === Job Application Routes ===
        app.get('/job-application', verifyToken, async (req, res) => {
            const email = req.query.email;

            if (req.user.email !== email) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const applications = await jobApplicationCollection.find({ applicant_email: email }).toArray();

            // Append job info to each application (basic join)
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

        app.get('/job-applications/jobs/:job_id', async (req, res) => {
            const jobId = req.params.job_id;
            const result = await jobApplicationCollection.find({ job_id: jobId }).toArray();
            res.send(result);
        });

        app.post('/job-applications', async (req, res) => {
            const application = req.body;
            const result = await jobApplicationCollection.insertOne(application);

            // Update job application count
            const job = await jobsCollection.findOne({ _id: new ObjectId(application.job_id) });

            let newCount = job?.applicationCount ? job.applicationCount + 1 : 1;

            await jobsCollection.updateOne(
                { _id: new ObjectId(application.job_id) },
                { $set: { applicationCount: newCount } }
            );

            res.send(result);
        });

        app.patch('/job-applications/:id', async (req, res) => {
            const id = req.params.id;
            const { status } = req.body;

            const result = await jobApplicationCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { status } }
            );

            res.send(result);
        });

    } finally {
        // No cleanup logic for now
    }
}

run().catch(console.dir);

// === Root Route ===
app.get('/', (req, res) => {
    res.send('Job is falling from the sky');
});

// === Start Server ===
app.listen(port, () => {
    console.log(`Job server running at port: ${port}`);
});
