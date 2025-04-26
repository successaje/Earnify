import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../../../declarations/earnify_backend';
import { Actor } from '@dfinity/agent';

// Determine network and identity provider
const network = process.env.DFX_NETWORK || 'local';
const II_URL = network === 'ic' 
  ? 'https://identity.ic0.app'  // Mainnet
  : 'http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943/'; // Local

// Backend canister ID - replace with your deployed canister ID
const CANISTER_ID = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';

// Create an agent for making calls to the Internet Computer
export const createAgent = async () => {
  try {
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();
    
    // Determine the host based on the environment
    const isLocal = network === 'local';
    const host = isLocal ? 'http://127.0.0.1:4943' : 'https://ic0.app';
    
    console.log('Creating agent with host:', host, 'network:', network);
    
    const agent = new HttpAgent({
      host,
      identity,
      fetchRootKey: isLocal // Only fetch root key in development
    });
    
    if (isLocal) {
      console.log('Fetching root key for development environment');
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await agent.fetchRootKey();
          console.log('Root key fetched successfully');
          break;
        } catch (error) {
          retryCount++;
          console.error(`Error fetching root key (attempt ${retryCount}/${maxRetries}):`, error);
          if (retryCount === maxRetries) {
            throw error;
          }
          // Wait for 1 second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    return { agent, authClient, identity };
  } catch (error) {
    console.error('Error creating agent:', error);
    throw error;
  }
};

// Create an actor for interacting with the backend canister
export const createActor = async () => {
  try {
    const { agent } = await createAgent();
    
    console.log('Creating actor for canister:', CANISTER_ID);
    
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: Principal.fromText(CANISTER_ID)
    });
    
    console.log('Actor created successfully');
    return actor;
  } catch (error) {
    console.error('Error creating actor:', error);
    throw error;
  }
};

// Login with Internet Identity
export const loginWithII = async () => {
  try {
    const { authClient } = await createAgent();
    
    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: II_URL,
        onSuccess: () => {
          console.log('Successfully logged in with Internet Identity');
          resolve(authClient.getIdentity());
        },
        onError: (err) => {
          console.error('Error logging in with Internet Identity:', err);
          reject(err);
        },
        windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
      });
    });
  } catch (error) {
    console.error('Error in loginWithII:', error);
    throw error;
  }
};

// Logout from Internet Identity
export const logoutFromII = async () => {
  try {
    const { authClient } = await createAgent();
    await authClient.logout();
    console.log('Successfully logged out from Internet Identity');
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { authClient } = await createAgent();
    return authClient.isAuthenticated();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get the current user's principal
export const getCurrentPrincipal = async () => {
  try {
    const { identity } = await createAgent();
    return identity.getPrincipal();
  } catch (error) {
    console.error('Error getting current principal:', error);
    throw error;
  }
};

// Get the current user's principal as a string
export const getCurrentPrincipalText = async () => {
  try {
    const principal = await getCurrentPrincipal();
    return principal.toText();
  } catch (error) {
    console.error('Error getting principal text:', error);
    throw error;
  }
};

// Create a user in the backend
export const createUser = async (userData) => {
  try {
    const actor = await createActor();
    const principal = await getCurrentPrincipal();
    
    console.log('Creating user with data:', { ...userData, principal: principal.toText() });
    const result = await actor.createUser(
      userData.username,
      userData.email,
      userData.bio,
      userData.skills,
      userData.role,
      userData.preferences
    );
    
    console.log('User creation result:', result);
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get user data from the backend
export const getUser = async (principal) => {
  try {
    const actor = await createActor();
    return actor.getUser(principal);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
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