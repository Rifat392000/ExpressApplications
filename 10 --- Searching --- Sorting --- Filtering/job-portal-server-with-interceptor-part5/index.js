// Step 1: Basic Server Setup & Middleware
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Security headers
app.use(helmet());


// Middleware: CORS
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Middleware: Runtime Environment Detection
app.use((req, res, next) => {
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    req.runtimeEnv = isSecure ? 'production' : 'development';
    
    if(req.runtimeEnv === 'development')
    {
        console.log(req.runtimeEnv);
    }

    next();
});

// JWT Token Verification Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.status(401).send({ message: 'unauthorized access' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).send({ message: 'unauthorized access vhi' });
        req.user = decoded;
        next();
    });
};

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_NAME}.${process.env.DB_CLUSTER_ID}.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_APP_NAME}`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// API Routes
async function run() {
    try {
        const jobsCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_1);
        const jobApplicationCollection = client.db(process.env.DB_NAME).collection(process.env.COLLECTION_NAME_2);

        // Auth Routes
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });

            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: req.runtimeEnv === 'production',
                    sameSite: req.runtimeEnv === 'production' ? 'none' : 'strict'
                })
                .send({ success: true });
        });

        app.post('/logout', (req, res) => {
            res
                .clearCookie('token', {
                    httpOnly: true,
                    secure: req.runtimeEnv === 'production',
                    sameSite: req.runtimeEnv === 'production' ? 'none' : 'strict'
                })
                .send({ success: true });
        });

// Job Routes
app.get('/jobs', async (req, res) => {
    const { sort, search, minSalary, maxSalary } = req.query;
    
    // Build query object
    let query = {};
    
    // Handle location search
    if (search && search.trim() !== '') {
        query = { ...query, location: { $regex: search, $options: 'i' } };
    }
    
    // Handle salary filtering
    if (minSalary && !isNaN(Number(minSalary)) && Number(minSalary) > 0) {
         query = { ...query,"salaryRange.min":{$gte: Number(minSalary)} };
    }
    
    if (maxSalary && !isNaN(Number(maxSalary)) && Number(maxSalary) > 0) {
        query = { ...query,"salaryRange.max":{$lte: Number(maxSalary)} };
    }
    
    // Build sort object
    let sortOptions = {};
    if (sort === 'true') {
        sortOptions = { "salaryRange.min": -1 };
    }
    
    // Execute query with filters and sorting
    const result = await jobsCollection.find(query).sort(sortOptions).toArray();
    res.send(result);
});

        app.get('/jobs/myposted',verifyToken, async (req, res) => {
            const email = req.query.email;
            const query = { hr_email: email };

             if (req.user.email !== email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            const result = await jobsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobsCollection.findOne(query);
            res.send(result);
        });

        app.post('/jobs', verifyToken, async (req, res) => {
            const newJob = req.body;
            // console.log(newJob.hr_email);
             if (req.user.email !== newJob?.hr_email) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            
            const result = await jobsCollection.insertOne(newJob);
            res.send(result);
        });

        // Job Applications
        app.get('/job-application', verifyToken, async (req, res) => {
            const email = req.query.email;
            const query = { applicant_email: email };

            if (req.user.email !== email) {
                return res.status(403).send({ message: 'forbidden access' });
            }

            const result = await jobApplicationCollection.find(query).toArray();

            for (const application of result) {
                const job = await jobsCollection.findOne({ _id: new ObjectId(application.job_id) });
                if (job) {
                    application.title = job.title;
                    application.location = job.location;
                    application.company = job.company;
                    application.company_logo = job.company_logo;
                }
            }

            res.send(result);
        });

        app.get('/job-applications/jobs/:job_id', async (req, res) => {
            const jobId = req.params.job_id;
            const query = { job_id: jobId };
            const result = await jobApplicationCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/job-applications', async (req, res) => {
            const application = req.body;
            const result = await jobApplicationCollection.insertOne(application);

            const jobId = application.job_id;
            const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });

            const newCount = job?.applicationCount ? job.applicationCount + 1 : 1;

            await jobsCollection.updateOne(
                { _id: new ObjectId(jobId) },
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
        // await client.close(); // Optional cleanup
    }
}
run().catch(console.dir);

// Root & Server
app.get('/', (req, res) => {
    res.send('Job is falling from the sky');
});

app.listen(port, () => {
    console.log(`🚀 Job server running at http://localhost:${port}`);
});
