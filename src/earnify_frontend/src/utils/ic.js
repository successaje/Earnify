import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../declarations/earnify_backend';
import { Actor } from '@dfinity/agent';

// Internet Identity URL - change this to your deployed II canister URL
const II_URL = 'https://identity.ic0.app';

// Backend canister ID - replace with your deployed canister ID
const CANISTER_ID = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';

// Create an agent for making calls to the Internet Computer
export const createAgent = async () => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();
  
  const agent = new HttpAgent({
    host: process.env.NODE_ENV === 'production' 
      ? 'https://ic0.app' 
      : 'http://localhost:4943',
    identity
  });
  
  // Only fetch root key in development
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }
  
  return { agent, authClient, identity };
};

// Create an actor for interacting with the backend canister
export const createActor = async () => {
  const { agent } = await createAgent();
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID,
  });
};

// Login with Internet Identity
export const loginWithII = async () => {
  const { authClient } = await createAgent();
  
  return new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: II_URL,
      onSuccess: () => resolve(authClient.getIdentity()),
      onError: (err) => reject(err),
    });
  });
};

// Logout from Internet Identity
export const logoutFromII = async () => {
  const { authClient } = await createAgent();
  await authClient.logout();
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const { authClient } = await createAgent();
  return authClient.isAuthenticated();
};

// Get the current user's principal
export const getCurrentPrincipal = async () => {
  const { identity } = await createAgent();
  return identity.getPrincipal();
};

// Get the current user's principal as a string
export const getCurrentPrincipalText = async () => {
  const principal = await getCurrentPrincipal();
  return principal.toText();
};

// Create a user in the backend
export const createUser = async (userData) => {
  const actor = await createActor();
  const principal = await getCurrentPrincipal();
  
  return actor.createUser(
    userData.username,
    userData.email,
    userData.bio,
    userData.skills,
    userData.role,
    userData.preferences
  );
};

// Get user data from the backend
export const getUser = async (principal) => {
  const actor = await createActor();
  return actor.getUser(principal);
};

// Update user data in the backend
export const updateUser = async (userData) => {
  const actor = await createActor();
  const principal = await getCurrentPrincipal();
  
  return actor.updateUser(
    userData.username,
    userData.email,
    userData.bio,
    userData.skills,
    userData.role,
    userData.preferences
  );
};

// Get all jobs from the backend
export const getAllJobs = async () => {
  const actor = await createActor();
  return actor.getAllJobs();
};

// Get a specific job from the backend
export const getJob = async (jobId) => {
  const actor = await createActor();
  return actor.getJob(jobId);
};

// Create a job in the backend
export const createJob = async (jobData) => {
  const actor = await createActor();
  
  return actor.createJob(
    jobData.title,
    jobData.company,
    jobData.description,
    jobData.requirements,
    jobData.salary,
    jobData.location,
    jobData.jobType,
    jobData.category,
    jobData.tags,
    jobData.remote,
    jobData.experienceLevel,
    jobData.benefits
  );
};

// Apply for a job
export const applyForJob = async (jobId, coverLetter, resume) => {
  const actor = await createActor();
  
  return actor.applyForJob(
    jobId,
    coverLetter,
    resume ? [new Uint8Array(resume)] : []
  );
};

// Get all applications for a job
export const getApplications = async (jobId) => {
  const actor = await createActor();
  return actor.getApplications(jobId);
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const actor = await createActor();
  return actor.updateApplicationStatus(applicationId, status);
};

// Get all categories
export const getAllCategories = async () => {
  const actor = await createActor();
  return actor.getAllCategories();
};

// Create a category
export const createCategory = async (name, description) => {
  const actor = await createActor();
  return actor.createCategory(name, description);
};

// Get job analytics
export const getJobAnalytics = async (jobId) => {
  const actor = await createActor();
  return actor.getJobAnalytics(jobId);
};

// Increment job views
export const incrementJobViews = async (jobId) => {
  const actor = await createActor();
  return actor.incrementJobViews(jobId);
};

// Get user notifications
export const getUserNotifications = async (principal) => {
  const actor = await createActor();
  return actor.getUserNotifications(principal);
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const actor = await createActor();
  return actor.markNotificationAsRead(notificationId);
};

// Search jobs
export const searchJobs = async (filters) => {
  const actor = await createActor();
  return actor.searchJobs(filters);
};

// Get job recommendations
export const getJobRecommendations = async (principal) => {
  const actor = await createActor();
  return actor.getJobRecommendations(principal);
}; 