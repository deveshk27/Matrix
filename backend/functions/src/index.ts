import { initializeApp } from "firebase-admin/app"; // Use /app for initializeApp with v9+ syntax
import { getFirestore } from "firebase-admin/firestore";
import { logger, setGlobalOptions } from "firebase-functions";
import { onRequest, onCall } from "firebase-functions/v2/https";
import { SUPPORTED_LANGUAGES } from "./utils";
// import cors from "cors";

initializeApp();

const db = getFirestore();

setGlobalOptions({maxInstances: 10});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const getSubmissions = onRequest({ cors: true }, async (request, response) => {
    try {
    const limit = (request.body.limit && typeof request.body.limit === 'number') ? request.body.limit : 10;
    logger.info(`Fetching submissions with limit: ${limit}`);

    // 1. Get the submission documents
    const submissionsQuerySnapshot = await db.collection("submissions")
      .limit(limit)
      .orderBy("submitTime", "desc")
      .get();

    logger.info(`Found ${submissionsQuerySnapshot.docs.length} submission documents.`);

    const submissionsWithUserDataPromises: Promise<any>[] = [];

    // 2. Iterate through each submission and fetch associated user data
    submissionsQuerySnapshot.docs.forEach(submissionDoc => {
      const submissionData = submissionDoc.data();
      const userId = submissionData.userId; // Correctly access the 'userId' field

      if (typeof userId === 'string' && userId) {
        // We push a promise into the array for each submission
        // This allows us to fetch user data for all submissions concurrently
        submissionsWithUserDataPromises.push(
          (async () => {
            try {
              // Create a DocumentReference to the user document
              const userRef = db.collection("users").doc(userId);
              const userSnapshot = await userRef.get();

              return {
                submission: submissionData,
                user: userSnapshot.exists ? userSnapshot.data() : null // Return user data, or null if user not found
              };
            } catch (userFetchError) {
              logger.error(`Error fetching user data for submission ID: ${submissionDoc.id} (User ID: ${userId}):`, userFetchError);
              // In case of error, still return the submission data but with null user
              return {
                submission: submissionData,
                user: null
              };
            }
          })() // Immediately invoke the async function to get the Promise
        );
      } else {
        logger.warn(`Submission ID: ${submissionDoc.id} has an invalid or missing userId:`, userId);
        // If userId is invalid, still add a resolved promise to keep `Promise.all` working
        submissionsWithUserDataPromises.push(Promise.resolve({
          submission: submissionData,
          user: null // No valid user ID found
        }));
      }
    });

    // 3. Wait for all user data fetches to complete
    const resolvedSubmissions = await Promise.all(submissionsWithUserDataPromises);

    logger.info("All submissions and user data fetched successfully.");
    response.status(200).send({
      response: resolvedSubmissions
    });

  } catch (error) {
    logger.error("Caught an unexpected error in getSubmissions function:", error);
    response.status(500).send({
      error: "An internal server error occurred while retrieving submissions."
    });
  }
});

export const submit = onCall(async (request) => {
  const uid = request.auth?.uid;
  const language = request.data.language;
  const submission = request.data.submission;
  const problemId = request.data.problemId;

  if(!uid) {
    return {
      message : "Unauthorized"
    }
  }

  if(!SUPPORTED_LANGUAGES.includes(language)) {
    return {
      message : "Language not supported"
    }
  }

  const problem = await db.collection("problems").doc(problemId?.toString()).get();
  if(!problem.exists) {
    return {
      message : "Problem doesn't exist"
    }
  }

  const doc = await db.collection("submissions").add({
    language,
    submission,
    problemId,
    userId : uid,
    submitTime : new Date(),
    workerTryCount : 0,
    status : "PENDING"
  })

  return {
    message : "Submission Done",
    id : doc.id
  }
})