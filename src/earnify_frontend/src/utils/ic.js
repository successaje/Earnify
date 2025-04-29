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

// Local canister ID - replace with your deployed canister ID
// const CANISTER_ID = 'bkyz2-fmaaa-aaaaa-qaaaq-cai';
// Production canister ID
const CANISTER_ID = '2pysh-dyaaa-aaaal-asd3a-cai';

// Singleton instances
let authClientInstance = null;
let agentInstance = null;
let actorInstance = null;
let isInitialized = false;

// Initialize the auth client, agent, and actor
export const initialize = async () => {
  try {
    if (authClientInstance) {
      console.log('Auth client already initialized');
      return { authClient: authClientInstance, agent: agentInstance, actor: actorInstance };
    }

    // Create a new auth client with persistence options
    const newAuthClient = await AuthClient.create({
      idleOptions: {
        disableDefaultIdleCallback: true,
        disableIdle: true
      },
      storage: {
        get: (key) => {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        set: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        remove: (key) => {
          localStorage.removeItem(key);
        }
      }
    });

    // Check if there's a saved identity
    const isAuthenticated = await newAuthClient.isAuthenticated();
    console.log('Is authenticated:', isAuthenticated);

    if (isAuthenticated) {
      console.log('Using saved identity');
      
      // Verify the identity is not anonymous
      const identity = newAuthClient.getIdentity();
      const principal = identity.getPrincipal();
      const principalText = principal.toText();
      
      if (principalText === '2vxsx-fae') {
        console.warn('Saved identity is anonymous, clearing it');
        await newAuthClient.logout();
        // Create a new auth client without the saved identity
        authClientInstance = await AuthClient.create();
      } else {
        authClientInstance = newAuthClient;
      }
    } else {
      authClientInstance = newAuthClient;
    }
    
    // Determine the host based on the environment
    const isLocal = network === 'local';
    const host = isLocal ? 'http://127.0.0.1:4943' : 'https://ic0.app';
    
    console.log('Creating agent with host:', host, 'network:', network);
    
    // Create a new agent with the auth client
    agentInstance = new HttpAgent({
      host,
      identity: authClientInstance.getIdentity()
    });

    // Fetch the root key in development or local environment
    if (isLocal) {
      console.log('Fetching root key for development environment');
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          await agentInstance.fetchRootKey();
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

    // Create a new actor with the agent
    console.log('Creating actor for canister:', CANISTER_ID);
    actorInstance = Actor.createActor(idlFactory, {
      agent: agentInstance,
      canisterId: Principal.fromText(CANISTER_ID)
    });
    
    console.log('Actor created successfully');
    isInitialized = true;
    
    return { authClient: authClientInstance, agent: agentInstance, actor: actorInstance };
  } catch (error) {
    console.error('Error initializing:', error);
    throw error;
  }
};

// Reset the cached instances (useful for logout)
export const resetInstances = () => {
  authClientInstance = null;
  agentInstance = null;
  actorInstance = null;
  isInitialized = false;
};

// Get the auth client
export const getAuthClient = async () => {
  if (!isInitialized) {
    await initialize();
  }
  return authClientInstance;
};

// Get the agent
export const getAgent = async () => {
  if (!isInitialized) {
    await initialize();
  }
  return agentInstance;
};

// Get the actor
export const getActor = async () => {
  if (!isInitialized) {
    await initialize();
  }
  return actorInstance;
};

// Login with Internet Identity
// export const loginWithII = async () => {
//   try {
//     // Reset any existing instances to start fresh
//     resetInstances();
    
//     // Create a new auth client
//     const authClient = await AuthClient.create();
    
//     // Start the Internet Identity login flow
//     return new Promise((resolve, reject) => {
//       authClient.login({
//         identityProvider: II_URL,
//         onSuccess: () => {
//           console.log('Login successful');
          
//           // Set the auth client instance
//           authClientInstance = authClient;
          
//           // Mark as initialized
//           isInitialized = true;
          
//           resolve(true);
//         },
//         onError: (err) => {
//           console.error('Login error:', err);
//           reject(err);
//         },
//         windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
//       });
//     });
//   } catch (error) {
//     console.error('Login failed:', error);
//     throw error;
//   }
// };

export const loginWithII = async () => {
  try {
    // Reset any existing instances
    resetInstances();
    
    // Create a fresh auth client
    const authClient = await AuthClient.create();
    
    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: II_URL,
        onSuccess: async () => {
          try {
            console.log('Login successful');
            
            // Verify authentication
            const isAuth = await authClient.isAuthenticated();
            if (!isAuth) {
              throw new Error('Not authenticated after login');
            }
            
            // Get and verify principal
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal();
            if (principal.toString() === '2vxsx-fae') {
              throw new Error('Anonymous principal after login');
            }
            
            // Update singleton instances
            authClientInstance = authClient;
            agentInstance = new HttpAgent({
              host: network === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
              identity: authClient.getIdentity()
            });
            
            if (network === 'local') {
              await agentInstance.fetchRootKey();
            }
            
            actorInstance = Actor.createActor(idlFactory, {
              agent: agentInstance,
              canisterId: Principal.fromText(CANISTER_ID)
            });
            
            isInitialized = true;
            resolve(true);
          } catch (err) {
            console.error('Post-login setup failed:', err);
            await authClient.logout();
            reject(err);
          }
        },
        onError: (err) => {
          console.error('Login error:', err);
          reject(err);
        },
        windowOpenerFeatures: "toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100",
      });
    });
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Logout from Internet Identity
export const logoutFromII = async () => {
  try {
    const authClient = await getAuthClient();
    await authClient.logout();
    console.log('Successfully logged out from Internet Identity');
    // Reset cached instances
    resetInstances();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const authClient = await getAuthClient();
    return authClient.isAuthenticated();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get the current user's principal
export const getCurrentPrincipal = async () => {
  try {
    // If not initialized, initialize first
    if (!isInitialized) {
      await initialize();
    }
    
    // Get the auth client
    const authClient = await getAuthClient();
    
    // Get the identity and principal
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
    
    // Check if the principal is anonymous
    const principalText = principal.toText();
    if (principalText === '2vxsx-fae') {
      console.warn('Anonymous principal detected');
    }
    
    return principal;
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

// Create a new user in the backend
export const createUser = async (userData) => {
  try {
    // Check if user is authenticated
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) {
      throw new Error('Authentication required. Please login with Internet Identity before creating a user.');
    }

    // Get the current principal to ensure it's not anonymous
    const principal = await getCurrentPrincipal();
    const principalText = principal.toText();
    
    // Check if the principal is anonymous (2vxsx-fae)
    if (principalText === '2vxsx-fae') {
      throw new Error('Anonymous principal detected. Please login with Internet Identity before creating a user.');
    }
    
    console.log('Creating user with authenticated principal:', principalText);
    
    const actor = await getActor();
    
    console.log('Creating user with data:', userData);

    const wrapOptText = (value) => value ? [value] : [];

    // Format social links according to the backend's expected structure
    // The entire socialLinks object needs to be wrapped as an optional value
    const socialLinksObj = userData.socialLinks ? {
      linkedin: wrapOptText(userData.socialLinks.linkedin),
      twitter: wrapOptText(userData.socialLinks.twitter),
      github: wrapOptText(userData.socialLinks.github),
      portfolio: wrapOptText(userData.socialLinks.portfolio) 
    } : [];
    
    // Wrap the entire socialLinks object as an optional value
    const socialLinks = userData.socialLinks ? [socialLinksObj] : [];

    // Format proof of work according to the backend's expected structure
    const proofOfWork = (userData.proofOfWork || []).map(pow => ({
      id: pow.id || crypto.randomUUID(),
      title: pow.title || "",
      description: pow.description || "",
      url: pow.url ? { Some: pow.url } : { None: null },
      date: pow.date || Date.now(),
      powType: pow.powType || "OTHER"
    }));
    
    console.log('Calling backend createUser with formatted data');
    const result = await actor.createUser(
      userData.username,
      userData.email,
      wrapOptText(userData.bio),
      userData.skills || [],
      userData.role || 'user',
      {
        preferredLocations: userData.preferences?.preferredLocations || [],
        preferredJobTypes: userData.preferences?.preferredJobTypes || [],
        preferredCategories: userData.preferences?.preferredCategories || [],
        salaryExpectation: userData.preferences?.salaryExpectation || 0.0,
        remotePreference: userData.preferences?.remotePreference || false,
        experienceLevel: userData.preferences?.experienceLevel || 'entry'
      },
      socialLinks,
      proofOfWork
    );

    console.log('Backend createUser response:', result);

    if ('ok' in result) {
      console.log('User created successfully:', result.ok);
      return { ok: result.ok };
    } else if ('err' in result) {
      console.error('Backend error creating user:', result.err);
      throw new Error(typeof result.err === 'string' ? result.err : 'Failed to create user');
    } else {
      console.error('Unexpected response format:', result);
      throw new Error('Unexpected response from backend');
    }
  } catch (error) {
    console.error('Error creating user:', error);
    // If the error is already an Error object, throw it as is
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise, wrap it in an Error object
    throw new Error(typeof error === 'string' ? error : 'Failed to create user');
  }
};

// Get user data from the backend
export const getUser = async (principal) => {
  try {
    const actor = await getActor();
    const result = await actor.getUser(principal);
    return result;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Update user data in the backend
export const updateUser = async (userData) => {
  try {
    const actor = await getActor();
    const principal = await getCurrentPrincipal();
    
    console.log('Updating user with data:', { ...userData, principal: principal.toText() });
    
    // Ensure we have a valid actor before proceeding
    if (!actor) {
      console.error('Actor is not initialized');
      throw new Error('Failed to connect to the backend. Please try again.');
    }
    
    const result = await actor.updateUser(
      userData.username,
      userData.email,
      userData.bio || '',
      userData.skills || [],
      userData.role || 'user',
      {
        preferredLocations: userData.preferences?.preferredLocations || [],
        preferredJobTypes: userData.preferences?.preferredJobTypes || [],
        preferredCategories: userData.preferences?.preferredCategories || [],
        salaryExpectation: userData.preferences?.salaryExpectation || 0.0,
        remotePreference: userData.preferences?.remotePreference || false,
        experienceLevel: userData.preferences?.experienceLevel || 'entry'
      },
      userData.socialLinks ? {
        linkedin: userData.socialLinks.linkedin ? [userData.socialLinks.linkedin] : [],
        twitter: userData.socialLinks.twitter ? [userData.socialLinks.twitter] : [],
        github: userData.socialLinks.github ? [userData.socialLinks.github] : [],
        portfolio: userData.socialLinks.portfolio ? [userData.socialLinks.portfolio] : []
      } : null,
      userData.proofOfWork || []
    );

    console.log('Update user result:', result);

    if ('ok' in result) {
      return result.ok;
    } else {
      console.error('Error updating user:', result.err);
      throw new Error(result.err);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Get all jobs from the backend
export const getAllJobs = async () => {
  const actor = await getActor();
  return actor.getAllJobs();
};

// Get a specific job from the backend
export const getJob = async (jobId) => {
  try {
    const actor = await getActor();
    const result = await actor.getJob(jobId);
    return result;
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

// Create a job in the backend
export const createJob = async (jobData) => {
  try {
    // Validate required fields
    if (!jobData.title?.trim()) {
      throw new Error('Title is required');
    }
    if (!jobData.company?.trim()) {
      throw new Error('Company name is required');
    }
    if (!jobData.description?.trim()) {
      throw new Error('Description is required');
    }
    if (!jobData.salary || parseFloat(jobData.salary) <= 0) {
      throw new Error('Salary must be greater than 0');
    }

    // Ensure arrays are properly formatted
    const requirements = Array.isArray(jobData.requirements) ? jobData.requirements : [];
    const tags = Array.isArray(jobData.tags) ? jobData.tags : [];
    const benefits = Array.isArray(jobData.benefits) ? jobData.benefits : [];

    // Set default values
    const job = {
      title: jobData.title.trim(),
      company: jobData.company.trim(),
      description: jobData.description.trim(),
      requirements,
      salary: parseFloat(jobData.salary),
      location: jobData.location?.trim() || 'Remote',
      jobType: jobData.jobType || 'Full-time',
      category: jobData.category || 'General',
      tags,
      remote: Boolean(jobData.remote),
      experienceLevel: jobData.experienceLevel || 'Mid-level',
      benefits,
    };

    console.log('Creating job with data:', job);
    const actor = await getActor();
    const result = await actor.createJob(
      job.title,
      job.company,
      job.description,
      job.requirements,
      job.salary,
      job.location,
      job.jobType,
      job.category,
      job.tags,
      job.remote,
      job.experienceLevel,
      job.benefits
    );

    console.log('Job creation result:', result);

    if ('err' in result) {
      throw new Error(result.err);
    }

    return result.ok;
  } catch (error) {
    console.error('Error in createJob:', error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (jobId, coverLetter, resume) => {
  const actor = await getActor();
  
  return actor.applyForJob(
    jobId,
    coverLetter,
    resume ? [new Uint8Array(resume)] : []
  );
};

// Get all applications for a job
export const getApplications = async (jobId) => {
  const actor = await getActor();
  return actor.getApplications(jobId);
};

// Update application status
export const updateApplicationStatus = async (applicationId, status) => {
  const actor = await getActor();
  return actor.updateApplicationStatus(applicationId, status);
};

// Get all categories
export const getAllCategories = async () => {
  const actor = await getActor();
  return actor.getAllCategories();
};

// Create a category
export const createCategory = async (name, description) => {
  const actor = await getActor();
  return actor.createCategory(name, description);
};

// Get job analytics
export const getJobAnalytics = async (jobId) => {
  const actor = await getActor();
  return actor.getJobAnalytics(jobId);
};

// Increment job views
export const incrementJobViews = async (jobId) => {
  const actor = await getActor();
  return actor.incrementJobViews(jobId);
};

// Get user notifications
export const getUserNotifications = async (principal) => {
  const actor = await getActor();
  return actor.getUserNotifications(principal);
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  const actor = await getActor();
  return actor.markNotificationAsRead(notificationId);
};

// Search jobs
export const searchJobs = async (filters) => {
  const actor = await getActor();
  return actor.searchJobs(filters);
};

// Get job recommendations
export const getJobRecommendations = async (principal) => {
  const actor = await getActor();
  return actor.getJobRecommendations(principal);
};

// Get all bounties from the backend
export const getAllBounties = async () => {
  const actor = await getActor();
  return actor.getAllBounties();
};

// Get a specific bounty from the backend
export const getBounty = async (bountyId) => {
  try {
    const actor = await getActor();
    const result = await actor.getBounty(bountyId);
    return result;
  } catch (error) {
    console.error('Error getting bounty:', error);
    throw error;
  }
};

// Create a bounty in the backend
export const createBounty = async (bountyData) => {
  try {
    const actor = await getActor();
    console.log('Creating bounty with data:', bountyData);
    
    // Validate required fields
    if (!bountyData.title || !bountyData.description || !bountyData.reward || !bountyData.deadline) {
      throw new Error('Missing required fields for bounty creation');
    }

    // Ensure arrays are properly formatted
    const skills = Array.isArray(bountyData.skills) ? bountyData.skills : [];
    const requirements = Array.isArray(bountyData.requirements) ? bountyData.requirements : [];
    const tags = Array.isArray(bountyData.tags) ? bountyData.tags : [];
    
    const result = await actor.createBounty(
      bountyData.title,
      bountyData.description,
      bountyData.reward,
      bountyData.currency || 'ICP',
      bountyData.deadline,
      bountyData.category || 'General',
      skills,
      requirements,
      tags
    );
    
    console.log('Bounty creation result:', result);
    
    // Check if result is an error
    if ('err' in result) {
      throw new Error(result.err);
    }
    
    // Return the bounty data
    return result.ok;
  } catch (error) {
    console.error('Error creating bounty:', error);
    throw error;
  }
};

// Submit to a bounty
export const submitBounty = async (bountyId, description, attachments) => {
  try {
    const actor = await getActor();
    
    // Ensure attachments is an array
    const attachmentsArray = Array.isArray(attachments) ? attachments : [];
    
    const result = await actor.submitBounty(
      bountyId,
      description,
      attachmentsArray
    );
    
    // Check if result is an error or success
    if (result.err) {
      throw new Error(result.err);
    }
    
    return result.ok;
  } catch (error) {
    console.error('Error submitting bounty:', error);
    throw error;
  }
};

// Get all submissions for a bounty
export const getBountySubmissions = async (bountyId) => {
  const actor = await getActor();
  return actor.getBountySubmissions(bountyId);
};

// Update bounty status
export const updateBountyStatus = async (bountyId, status) => {
  const actor = await getActor();
  return actor.updateBountyStatus(bountyId, status);
};

// Update submission status
export const updateSubmissionStatus = async (submissionId, status, feedback) => {
  const actor = await getActor();
  return actor.updateSubmissionStatus(submissionId, status, feedback);
};

// Increment bounty views
export const incrementBountyViews = async (bountyId) => {
  const actor = await getActor();
  return actor.incrementBountyViews(bountyId);
};

// Get bounty analytics
export const getBountyAnalytics = async (bountyId) => {
  const actor = await getActor();
  return actor.getBountyAnalytics(bountyId);
};

// Get all users for the leaderboard
export const getAllUsers = async () => {
  try {
    const actor = await getActor();
    const result = await actor.getAllUsers();
    if (result.ok) {
      return result.ok;
    } else {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Update social links
export const updateSocialLinks = async (socialLinks) => {
  try {
    const actor = await getActor();
    const result = await actor.updateSocialLinks(
      Array.isArray(socialLinks.linkedin) ? socialLinks.linkedin : (socialLinks.linkedin ? [socialLinks.linkedin] : []),
      Array.isArray(socialLinks.twitter) ? socialLinks.twitter : (socialLinks.twitter ? [socialLinks.twitter] : []),
      Array.isArray(socialLinks.github) ? socialLinks.github : (socialLinks.github ? [socialLinks.github] : []),
      Array.isArray(socialLinks.portfolio) ? socialLinks.portfolio : (socialLinks.portfolio ? [socialLinks.portfolio] : [])
    );

    if ('ok' in result) {
      return result.ok;
    } else {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error('Error updating social links:', error);
    throw error;
  }
};

// Add proof of work
export const addProofOfWork = async (proofOfWork) => {
  try {
    const actor = await getActor();
    const result = await actor.addProofOfWork(
      proofOfWork.title || "",
      proofOfWork.description || "",
      proofOfWork.url || "",  // Changed from null to empty string for consistency
      proofOfWork.type || "OTHER"  // Added default type
    );

    if ('ok' in result) {
      return result.ok;
    } else {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error('Error adding proof of work:', error);
    throw error;
  }
};

// Remove proof of work
export const removeProofOfWork = async (id) => {
  try {
    const actor = await getActor();
    const result = await actor.removeProofOfWork(id);

    if ('ok' in result) {
      return result.ok;
    } else {
      throw new Error(result.err);
    }
  } catch (error) {
    console.error('Error removing proof of work:', error);
    throw error;
  }
};

export const createVerificationRequest = async (formData) => {
  try {
    const principal = await getCurrentPrincipal();
    if (!principal || principal.isAnonymous()) {
      throw new Error('User must be authenticated');
    }

    const requestData = {
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      description: formData.description,
      website: formData.website,
      documents: formData.documents,
      status: 'pending',
      createdAt: BigInt(Date.now()),
      updatedAt: BigInt(Date.now())
    };

    const result = await actor.createVerificationRequest(requestData);
    return result;
  } catch (error) {
    console.error('Error creating verification request:', error);
    throw error;
  }
};

export const getVerificationRequest = async () => {
  try {
    const principal = await getCurrentPrincipal();
    if (!principal || principal.isAnonymous()) {
      throw new Error('User must be authenticated');
    }

    const request = await actor.getVerificationRequest(principal);
    return request;
  } catch (error) {
    console.error('Error getting verification request:', error);
    throw error;
  }
}; 