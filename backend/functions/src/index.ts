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
    // const offset = request.body.offset;
    const limit = request.body.limit || 10;
    const res = await db.collection("submissions").limit(limit).orderBy("submitTime", "desc").get();
    const submissions : any[] = [];
    console.log("res.docs")
    console.log(res.docs.length)
    res.docs.forEach(async doc => {
        console.log("doc1");
        submissions.push(new Promise(async (resolve) => {
                console.log(doc.data().user)
                const snapshot = await doc.data().user.get();
                resolve({
                    submission: doc.data(),
                    user: snapshot.data()
                })
        }))
    })

    response.send({
        response: await Promise.all(submissions)
    })
})

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