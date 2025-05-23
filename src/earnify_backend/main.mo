import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Order "mo:base/Order";

import Types "types";


actor Earnify {

    // Types
    type UserProfile = Types.UserProfile;
    type Job = Types.Job;
    type Application = Types.Application;
    type JobCategory = Types.JobCategory;
    type JobPreferences = Types.JobPreferences;
    type Experience = Types.Experience;
    type Education = Types.Education;
    type Notification = Types.Notification;
    type JobAnalytics = Types.JobAnalytics;
    type SearchFilters = Types.SearchFilters;
    type Bounty = Types.Bounty;
    type BountySubmission = Types.BountySubmission;
    type BountyAnalytics = Types.BountyAnalytics;
    type VerificationRequest = Types.VerificationRequest;
    


    // State
    private var users = HashMap.HashMap<Principal, UserProfile>(0, Principal.equal, Principal.hash);
    private var jobs = HashMap.HashMap<Text, Job>(0, Text.equal, Text.hash);
    private var applications = HashMap.HashMap<Text, Application>(0, Text.equal, Text.hash);
    private var categories = HashMap.HashMap<Text, JobCategory>(0, Text.equal, Text.hash);
    private var userSessions = HashMap.HashMap<Principal, Text>(0, Principal.equal, Principal.hash);
    private var notifications = HashMap.HashMap<Text, Notification>(0, Text.equal, Text.hash);
    private var jobAnalytics = HashMap.HashMap<Text, JobAnalytics>(0, Text.equal, Text.hash);
    private var bounties = HashMap.HashMap<Text, Bounty>(0, Text.equal, Text.hash);
    private var bountySubmissions = HashMap.HashMap<Text, BountySubmission>(0, Text.equal, Text.hash);
    private var bountyAnalytics = HashMap.HashMap<Text, BountyAnalytics>(0, Text.equal, Text.hash);
    private var verificationRequests = HashMap.HashMap<Text, VerificationRequest>(0, Text.equal, Text.hash);
    
    // Initialize with some default categories
    private func initializeCategories() {
        let defaultCategories = [
            {id = "tech"; name = "Technology"; description = "Software, IT, and Tech jobs"},
            {id = "finance"; name = "Finance"; description = "Banking, Investment, and Financial Services"},
            {id = "healthcare"; name = "Healthcare"; description = "Medical, Health, and Wellness"},
            {id = "education"; name = "Education"; description = "Teaching, Training, and Academic"},
            {id = "marketing"; name = "Marketing"; description = "Advertising, PR, and Marketing"}
        ];
        
        for (category in defaultCategories.vals()) {
            categories.put(category.id, category);
        };
    };
    
    // User Management
    public shared(msg) func createUser(
        username: Text,
        email: Text,
        bio: ?Text,
        skills: [Text],
        role: Text,
        preferences: JobPreferences,
        socialLinks: ?Types.SocialLinks,
        proofOfWork: [Types.ProofOfWork]
    ) : async Result.Result<UserProfile, Text> {
        let principal = msg.caller;
        
        if (users.get(principal) != null) {
            return #err("User already exists");
        };

        if (msg.caller == Principal.fromText("2vxsx-fae")) {
            // 2vxsx-fae is anonymous
            return #err("Anonymous callers are not allowed");
        };
        
        let now = Int.abs(Time.now());
        let user = {
            principal = principal;
            username = username;
            email = email;
            bio = bio;
            skills = skills;
            experience = [];
            education = [];
            createdAt = now;
            updatedAt = now;
            role = role;
            verified = false;
            verificationType = null;
            verificationRequestId = null;
            preferences = preferences;
            socialLinks = socialLinks;
            proofOfWork = proofOfWork;
            totalEarnings = 0.0;
            completedJobs = 0;
            completedBounties = 0;
            reputation = 0.0;
        };
        
        users.put(principal, user);
        
        return #ok(user);
    };
    
    public query func getUser(principal: Principal) : async Result.Result<UserProfile, Text> {
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) { #ok(user) };
        };
    };
    
    public shared(msg) func updateUser(
        username: Text,
        email: Text,
        bio: Text,
        skills: [Text],
        role: Text,
        preferences: JobPreferences,
        socialLinks: ?{
            linkedin: ?Text;
            twitter: ?Text;
            github: ?Text;
            portfolio: ?Text;
        },
        proofOfWork: [Types.ProofOfWork]
    ) : async Result.Result<UserProfile, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                let updatedUser = {
                    principal = user.principal;
                    username = username;
                    email = email;
                    bio = ?bio;
                    skills = skills;
                    experience = user.experience;
                    education = user.education;
                    createdAt = user.createdAt;
                    updatedAt = Int.abs(Time.now());
                    role = role;
                    verified = user.verified;
                    verificationType = user.verificationType;
                    verificationRequestId = user.verificationRequestId;
                    preferences = preferences;
                    completedJobs = user.completedJobs;
                    completedBounties = user.completedBounties;
                    totalEarnings = user.totalEarnings;
                    reputation = user.reputation;
                    proofOfWork = proofOfWork;
                    socialLinks = socialLinks;
                };
                
                users.put(principal, updatedUser);
                #ok(updatedUser)
            };
        };
    };
    
    // Job Management
    public shared(msg) func createJob(
        title: Text,
        company: Text,
        description: Text,
        requirements: [Text],
        salary: Float,
        location: Text,
        jobType: Text,
        category: Text,
        tags: [Text],
        remote: Bool,
        experienceLevel: Text,
        benefits: [Text]
    ) : async Result.Result<Job, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                if (user.role != "employer") {
                    return #err("Only employers can post jobs");
                };
                
                let jobId = Text.concat(Principal.toText(principal), Nat.toText(Int.abs(Time.now())));
                
                let job = {
                    id = jobId;
                    title = title;
                    company = company;
                    description = description;
                    requirements = requirements;
                    salary = salary;
                    location = location;
                    jobType = jobType;
                    category = category;
                    postedBy = principal;
                    postedAt = Int.abs(Time.now());
                    status = "Open";
                    applications = [];
                    tags = tags;
                    remote = remote;
                    experienceLevel = experienceLevel;
                    benefits = benefits;
                    views = 0;
                    applicationCount = 0;
                };
                
                jobs.put(jobId, job);
                
                // Initialize analytics for the job
                let analytics = {
                    jobId = jobId;
                    views = 0;
                    applications = 0;
                    uniqueApplicants = 0;
                    averageApplicationTime = 0;
                    conversionRate = 0.0;
                };
                
                jobAnalytics.put(jobId, analytics);
                #ok(job)
            };
        };
    };
    
    public query func getJob(jobId: Text) : async Result.Result<Job, Text> {
        switch (jobs.get(jobId)) {
            case (null) { #err("Job not found") };
            case (?job) { #ok(job) };
        };
    };
    
    public query func getAllJobs() : async [Job] {
        Iter.toArray(jobs.vals())
    };
    
    // Search and Filter Jobs
    public query func searchJobs(filters: SearchFilters) : async [Job] {
        let results = Buffer.Buffer<Job>(0);
        
        for ((_, job) in jobs.entries()) {
            if (job.status == "Open") { 
                ignore "everything";
            };
            
            var matches = true;
            
            switch (filters.category) {
                case (?category) { if (job.category != category) { matches := false } };
                case (null) { };
            };
            
            switch (filters.location) {
                case (?location) { if (job.location != location) { matches := false } };
                case (null) { };
            };
            
            switch (filters.jobType) {
                case (?jobType) { if (job.jobType != jobType) { matches := false } };
                case (null) { };
            };
            
            switch (filters.remote) {
                case (?remote) { if (job.remote != remote) { matches := false } };
                case (null) { };
            };
            
            switch (filters.experienceLevel) {
                case (?level) { if (job.experienceLevel != level) { matches := false } };
                case (null) { };
            };
            
            switch (filters.salaryMin) {
                case (?min) { if (job.salary < min) { matches := false } };
                case (null) { };
            };
            
            switch (filters.salaryMax) {
                case (?max) { if (job.salary > max) { matches := false } };
                case (null) { };
            };
            
            if (matches) {
                results.add(job);
            };
        };
        
        return Buffer.toArray(results)
    };
    
    // Helper function to check if an element exists in an array
    private func arrayContains<T>(array: [T], element: T, equal: (T, T) -> Bool) : Bool {
        for (item in array.vals()) {
            if (equal(item, element)) {
                return true;
            };
        };
        false
    };

    // Job Recommendations
    public query func getJobRecommendations(principal: Principal) : async Result.Result<[Job], Text> {
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                let recommendations = Buffer.Buffer<Job>(0);
                
                for ((_, job) in jobs.entries()) {
                    if (job.status != "Open") {  };
                    
                    var matchScore = 0;
                    
                    // Check if job matches user preferences
                    if (arrayContains(user.preferences.preferredCategories, job.category, Text.equal)) {
                        matchScore += 2;
                    };
                    
                    if (arrayContains(user.preferences.preferredJobTypes, job.jobType, Text.equal)) {
                        matchScore += 2;
                    };
                    
                    if (arrayContains(user.preferences.preferredLocations, job.location, Text.equal)) {
                        matchScore += 2;
                    };
                    
                    if (job.remote == user.preferences.remotePreference) {
                        matchScore += 1;
                    };
                    
                    // Check skill matches
                    for (req in job.requirements.vals()) {
                        if (arrayContains(user.skills, req, Text.equal)) {
                            matchScore += 1;
                        };
                    };
                    
                    // Add job to recommendations if it has a good match score
                    if (matchScore >= 3) {
                        recommendations.add(job);
                    };
                };
                
                #ok(Buffer.toArray(recommendations))
            };
        };
    };
    
    // Application Management
    public shared(msg) func applyForJob(
        jobId: Text,
        coverLetter: Text,
        resume: ?Blob
    ) : async Result.Result<Application, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                if (user.role != "job_seeker") {
                    return #err("Only job seekers can apply for jobs");
                };
                
                switch (jobs.get(jobId)) {
                    case (null) { #err("Job not found") };
                    case (?job) {
                        if (job.status != "Open") {
                            return #err("Job is not open for applications");
                        };
                        
                        let applicationId = Text.concat(jobId, Principal.toText(principal));
                        
                        let application = {
                            id = applicationId;
                            jobId = jobId;
                            applicant = principal;
                            coverLetter = coverLetter;
                            status = "Pending";
                            appliedAt = Int.abs(Time.now());
                            updatedAt = Int.abs(Time.now());
                            resume = resume;
                        };
                        
                        applications.put(applicationId, application);
                        
                        // Update job applications
                        let updatedJob = {
                            id = job.id;
                            title = job.title;
                            company = job.company;
                            description = job.description;
                            requirements = job.requirements;
                            salary = job.salary;
                            location = job.location;
                            jobType = job.jobType;
                            category = job.category;
                            postedBy = job.postedBy;
                            postedAt = job.postedAt;
                            status = job.status;
                            applications = Array.append(job.applications, [principal]);
                            tags = job.tags;
                            remote = job.remote;
                            experienceLevel = job.experienceLevel;
                            benefits = job.benefits;
                            views = job.views;
                            applicationCount = job.applicationCount + 1;
                        };
                        
                        jobs.put(jobId, updatedJob);
                        
                        // Update analytics
                        switch (jobAnalytics.get(jobId)) {
                            case (?analytics) {
                                let updatedAnalytics = {
                                    jobId = analytics.jobId;
                                    views = analytics.views;
                                    applications = analytics.applications + 1;
                                    uniqueApplicants = analytics.uniqueApplicants + 1;
                                    averageApplicationTime = analytics.averageApplicationTime;
                                    conversionRate = Float.fromInt(analytics.applications + 1) / Float.fromInt(analytics.views);
                                };
                                jobAnalytics.put(jobId, updatedAnalytics);
                            };
                            case (null) { };
                        };
                        
                        // Create notification for employer
                        let notificationId = Text.concat("notif_", Nat.toText(Int.abs(Time.now())));
                        let notification = {
                            id = notificationId;
                            userId = job.postedBy;
                            title = "New Job Application";
                            message = Text.concat("New application for ", job.title);
                            notificationType = "application";
                            read = false;
                            createdAt = Int.abs(Time.now());
                            data = applicationId;
                        };
                        notifications.put(notificationId, notification);
                        
                        #ok(application)
                    };
                };
            };
        };
    };
    
    public query func getApplications(jobId: Text) : async [Application] {
        let jobApplications = Buffer.Buffer<Application>(0);
        
        for ((_, application) in applications.entries()) {
            if (application.jobId == jobId) {
                jobApplications.add(application);
            };
        };
        
        Buffer.toArray(jobApplications)
    };
    
    public shared(msg) func updateApplicationStatus(
        applicationId: Text,
        status: Text
    ) : async Result.Result<Application, Text> {
        let principal = msg.caller;
        
        switch (applications.get(applicationId)) {
            case (null) { #err("Application not found") };
            case (?application) {
                switch (jobs.get(application.jobId)) {
                    case (null) { #err("Job not found") };
                    case (?job) {
                        if (job.postedBy != principal) {
                            return #err("Unauthorized to update application status");
                        };
                        
                        let updatedApplication = {
                            id = application.id;
                            jobId = application.jobId;
                            applicant = application.applicant;
                            coverLetter = application.coverLetter;
                            status = status;
                            appliedAt = application.appliedAt;
                            updatedAt = Int.abs(Time.now());
                            resume = application.resume;
                        };
                        
                        applications.put(applicationId, updatedApplication);
                        
                        // Create notification for applicant
                        let notificationId = Text.concat("notif_", Nat.toText(Int.abs(Time.now())));
                        let notification = {
                            id = notificationId;
                            userId = application.applicant;
                            title = "Application Status Updated";
                            message = "Your application for " # job.title #" has been " # status;
                            notificationType = "status_update";
                            read = false;
                            createdAt = Int.abs(Time.now());
                            data = applicationId;
                        };
                        notifications.put(notificationId, notification);
                        
                        #ok(updatedApplication)
                    };
                };
            };
        };
    };
    
    // Category Management
    public query func getAllCategories() : async [JobCategory] {
        Iter.toArray(categories.vals())
    };
    
    public shared(msg) func createCategory(
        name: Text,
        description: Text
    ) : async Result.Result<JobCategory, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                if (user.role != "employer") {
                    return #err("Only employers can create categories");
                };
                
                let categoryId = Text.concat("cat_", Nat.toText(Int.abs(Time.now())));
                
                let category = {
                    id = categoryId;
                    name = name;
                    description = description;
                };
                
                categories.put(categoryId, category);
                #ok(category)
            };
        };
    };
    
    // Analytics
    public query func getJobAnalytics(jobId: Text) : async Result.Result<JobAnalytics, Text> {
        switch (jobAnalytics.get(jobId)) {
            case (null) { #err("Analytics not found") };
            case (?analytics) { #ok(analytics) };
        };
    };
    
    public shared(msg) func incrementJobViews(jobId: Text) : async Result.Result<(), Text> {
        switch (jobs.get(jobId)) {
            case (null) { #err("Job not found") };
            case (?job) {
                let updatedJob = {
                    id = job.id;
                    title = job.title;
                    company = job.company;
                    description = job.description;
                    requirements = job.requirements;
                    salary = job.salary;
                    location = job.location;
                    jobType = job.jobType;
                    category = job.category;
                    postedBy = job.postedBy;
                    postedAt = job.postedAt;
                    status = job.status;
                    applications = job.applications;
                    tags = job.tags;
                    remote = job.remote;
                    experienceLevel = job.experienceLevel;
                    benefits = job.benefits;
                    views = job.views + 1;
                    applicationCount = job.applicationCount;
                };
                
                jobs.put(jobId, updatedJob);
                
                // Update analytics
                switch (jobAnalytics.get(jobId)) {
                    case (?analytics) {
                        let updatedAnalytics = {
                            jobId = analytics.jobId;
                            views = analytics.views + 1;
                            applications = analytics.applications;
                            uniqueApplicants = analytics.uniqueApplicants;
                            averageApplicationTime = analytics.averageApplicationTime;
                            conversionRate = Float.fromInt(analytics.applications) / Float.fromInt(analytics.views + 1);
                        };
                        jobAnalytics.put(jobId, updatedAnalytics);
                    };
                    case (null) { };
                };
                
                #ok()
            };
        };
    };
    
    // Notifications
    public query func getUserNotifications(principal: Principal) : async [Notification] {
        let userNotifications = Buffer.Buffer<Notification>(0);
        
        for ((_, notification) in notifications.entries()) {
            if (notification.userId == principal) {
                userNotifications.add(notification);
            };
        };
        
        Buffer.toArray(userNotifications)
    };
    
    public shared(msg) func markNotificationAsRead(notificationId: Text) : async Result.Result<(), Text> {
        let principal = msg.caller;
        
        switch (notifications.get(notificationId)) {
            case (null) { #err("Notification not found") };
            case (?notification) {
                if (notification.userId != principal) {
                    return #err("Unauthorized to update notification");
                };
                
                let updatedNotification = {
                    id = notification.id;
                    userId = notification.userId;
                    title = notification.title;
                    message = notification.message;
                    notificationType = notification.notificationType;
                    read = true;
                    createdAt = notification.createdAt;
                    data = notification.data;
                };
                
                notifications.put(notificationId, updatedNotification);
                #ok()
            };
        };
    };
    
    // User Authentication
    private func generateSessionToken(principal: Principal) : Text {
        let timestamp = Int.abs(Time.now());
        let random = Nat.toText(timestamp);
        Text.concat(Principal.toText(principal), Text.concat("_", random))
    };
    
    public shared(msg) func login() : async Result.Result<Text, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                let token = generateSessionToken(principal);
                userSessions.put(principal, token);
                #ok(token)
            };
        };
    };
    
    public shared(msg) func logout() : async Result.Result<(), Text> {
        let principal = msg.caller;
        userSessions.delete(principal);
        #ok()
    };
    
    public shared(msg) func verifySession(token: Text) : async Bool {
        let principal = msg.caller;
        switch (userSessions.get(principal)) {
            case (?sessionToken) { sessionToken == token };
            case (null) { false };
        };
    };

    // Bounty Management
    public shared(msg) func createBounty(
        title: Text,
        description: Text,
        reward: Float,
        currency: Text,
        deadline: Int,
        category: Text,
        skills: [Text],
        requirements: [Text],
        tags: [Text]
    ) : async Result.Result<Bounty, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                if (user.role != "employer") {
                    return #err("Only employers can post bounties");
                };
                
                let bountyId = Text.concat("bounty_", Nat.toText(Int.abs(Time.now())));
                
                let bounty = {
                    id = bountyId;
                    title = title;
                    description = description;
                    reward = reward;
                    currency = currency;
                    deadline = deadline;
                    status = "open";
                    category = category;
                    skills = skills;
                    postedBy = principal;
                    postedAt = Int.abs(Time.now());
                    submissions = [];
                    requirements = requirements;
                    tags = tags;
                    views = 0;
                    submissionCount = 0;
                };
                
                bounties.put(bountyId, bounty);
                
                // Initialize analytics for the bounty
                let analytics = {
                    bountyId = bountyId;
                    views = 0;
                    submissions = 0;
                    uniqueSubmitters = 0;
                    averageSubmissionTime = 0;
                    conversionRate = 0.0;
                };
                
                bountyAnalytics.put(bountyId, analytics);
                #ok(bounty)
            };
        };
    };
    
    public query func getBounty(bountyId: Text) : async Result.Result<Bounty, Text> {
        switch (bounties.get(bountyId)) {
            case (null) { #err("Bounty not found") };
            case (?bounty) { #ok(bounty) };
        };
    };
    
    public query func getAllBounties() : async [Bounty] {
        Iter.toArray(bounties.vals())
    };
    
    public shared(msg) func submitBounty(
        bountyId: Text,
        description: Text,
        attachments: [Text]
    ) : async Result.Result<BountySubmission, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                if (user.role != "job_seeker") {
                    return #err("Only job seekers can submit to bounties");
                };
                
                switch (bounties.get(bountyId)) {
                    case (null) { #err("Bounty not found") };
                    case (?bounty) {
                        if (bounty.status != "open") {
                            return #err("Bounty is not open for submissions");
                        };
                        
                        let submissionId = Text.concat(bountyId, Principal.toText(principal));
                        
                        let submission = {
                            id = submissionId;
                            bountyId = bountyId;
                            submitter = principal;
                            description = description;
                            status = "pending";
                            submittedAt = Int.abs(Time.now());
                            updatedAt = Int.abs(Time.now());
                            attachments = attachments;
                            feedback = null;
                        };
                        
                        bountySubmissions.put(submissionId, submission);
                        
                        // Update bounty submissions
                        let updatedBounty = {
                            id = bounty.id;
                            title = bounty.title;
                            description = bounty.description;
                            reward = bounty.reward;
                            currency = bounty.currency;
                            deadline = bounty.deadline;
                            status = bounty.status;
                            category = bounty.category;
                            skills = bounty.skills;
                            postedBy = bounty.postedBy;
                            postedAt = bounty.postedAt;
                            submissions = Array.append(bounty.submissions, [submission]);
                            requirements = bounty.requirements;
                            tags = bounty.tags;
                            views = bounty.views;
                            submissionCount = bounty.submissionCount + 1;
                        };
                        
                        bounties.put(bountyId, updatedBounty);
                        
                        // Update analytics
                        switch (bountyAnalytics.get(bountyId)) {
                            case (?analytics) {
                                let updatedAnalytics = {
                                    bountyId = analytics.bountyId;
                                    views = analytics.views;
                                    submissions = analytics.submissions + 1;
                                    uniqueSubmitters = analytics.uniqueSubmitters + 1;
                                    averageSubmissionTime = analytics.averageSubmissionTime;
                                    conversionRate = Float.fromInt(analytics.submissions + 1) / Float.fromInt(analytics.views);
                                };
                                bountyAnalytics.put(bountyId, updatedAnalytics);
                            };
                            case (null) { };
                        };
                        
                        // Create notification for bounty poster
                        let notificationId = Text.concat("notif_", Nat.toText(Int.abs(Time.now())));
                        let notification = {
                            id = notificationId;
                            userId = bounty.postedBy;
                            title = "New Bounty Submission";
                            message = Text.concat("New submission for ", bounty.title);
                            notificationType = "submission";
                            read = false;
                            createdAt = Int.abs(Time.now());
                            data = submissionId;
                        };
                        notifications.put(notificationId, notification);
                        
                        #ok(submission)
                    };
                };
            };
        };
    };
    
    public query func getBountySubmissions(bountyId: Text) : async [BountySubmission] {
        let bountySubs = Buffer.Buffer<BountySubmission>(0);
        
        for ((_, submission) in bountySubmissions.entries()) {
            if (submission.bountyId == bountyId) {
                bountySubs.add(submission);
            };
        };
        
        Buffer.toArray(bountySubs)
    };
    
    public shared(msg) func updateBountyStatus(
        bountyId: Text,
        status: Text
    ) : async Result.Result<Bounty, Text> {
        let principal = msg.caller;
        
        switch (bounties.get(bountyId)) {
            case (null) { #err("Bounty not found") };
            case (?bounty) {
                if (bounty.postedBy != principal) {
                    return #err("Unauthorized to update bounty status");
                };
                
                let updatedBounty = {
                    id = bounty.id;
                    title = bounty.title;
                    description = bounty.description;
                    reward = bounty.reward;
                    currency = bounty.currency;
                    deadline = bounty.deadline;
                    status = status;
                    category = bounty.category;
                    skills = bounty.skills;
                    postedBy = bounty.postedBy;
                    postedAt = bounty.postedAt;
                    submissions = bounty.submissions;
                    requirements = bounty.requirements;
                    tags = bounty.tags;
                    views = bounty.views;
                    submissionCount = bounty.submissionCount;
                };
                
                bounties.put(bountyId, updatedBounty);
                
                // Create notification for all submitters
                for (submission in bounty.submissions.vals()) {
                    let notificationId = Text.concat("notif_", Nat.toText(Int.abs(Time.now())));
                    let notification = {
                        id = notificationId;
                        userId = submission.submitter;
                        title = "Bounty Status Updated";
                        message = "The bounty " # bounty.title # " has been " # status;
                        notificationType = "status_update";
                        read = false;
                        createdAt = Int.abs(Time.now());
                        data = bountyId;
                    };
                    notifications.put(notificationId, notification);
                };
                
                #ok(updatedBounty)
            };
        };
    };
    
    public shared(msg) func updateSubmissionStatus(
        submissionId: Text,
        status: Text,
        feedback: ?Text
    ) : async Result.Result<BountySubmission, Text> {
        let principal = msg.caller;
        
        switch (bountySubmissions.get(submissionId)) {
            case (null) { #err("Submission not found") };
            case (?submission) {
                switch (bounties.get(submission.bountyId)) {
                    case (null) { #err("Bounty not found") };
                    case (?bounty) {
                        if (bounty.postedBy != principal) {
                            return #err("Unauthorized to update submission status");
                        };
                        
                        let updatedSubmission = {
                            id = submission.id;
                            bountyId = submission.bountyId;
                            submitter = submission.submitter;
                            description = submission.description;
                            status = status;
                            submittedAt = submission.submittedAt;
                            updatedAt = Int.abs(Time.now());
                            attachments = submission.attachments;
                            feedback = feedback;
                        };
                        
                        bountySubmissions.put(submissionId, updatedSubmission);
                        
                        // Create notification for submitter
                        let notificationId = Text.concat("notif_", Nat.toText(Int.abs(Time.now())));
                        let notification = {
                            id = notificationId;
                            userId = submission.submitter;
                            title = "Submission Status Updated";
                            message = "Your submission for " # bounty.title # " has been " # status;
                            notificationType = "status_update";
                            read = false;
                            createdAt = Int.abs(Time.now());
                            data = submissionId;
                        };
                        notifications.put(notificationId, notification);
                        
                        #ok(updatedSubmission)
                    };
                };
            };
        };
    };
    
    public shared(msg) func incrementBountyViews(bountyId: Text) : async Result.Result<(), Text> {
        switch (bounties.get(bountyId)) {
            case (null) { #err("Bounty not found") };
            case (?bounty) {
                let updatedBounty = {
                    id = bounty.id;
                    title = bounty.title;
                    description = bounty.description;
                    reward = bounty.reward;
                    currency = bounty.currency;
                    deadline = bounty.deadline;
                    status = bounty.status;
                    category = bounty.category;
                    skills = bounty.skills;
                    postedBy = bounty.postedBy;
                    postedAt = bounty.postedAt;
                    submissions = bounty.submissions;
                    requirements = bounty.requirements;
                    tags = bounty.tags;
                    views = bounty.views + 1;
                    submissionCount = bounty.submissionCount;
                };
                
                bounties.put(bountyId, updatedBounty);
                
                // Update analytics
                switch (bountyAnalytics.get(bountyId)) {
                    case (?analytics) {
                        let updatedAnalytics = {
                            bountyId = analytics.bountyId;
                            views = analytics.views + 1;
                            submissions = analytics.submissions;
                            uniqueSubmitters = analytics.uniqueSubmitters;
                            averageSubmissionTime = analytics.averageSubmissionTime;
                            conversionRate = Float.fromInt(analytics.submissions) / Float.fromInt(analytics.views + 1);
                        };
                        bountyAnalytics.put(bountyId, updatedAnalytics);
                    };
                    case (null) { };
                };
                
                #ok()
            };
        };
    };
    
    public query func getBountyAnalytics(bountyId: Text) : async Result.Result<BountyAnalytics, Text> {
        switch (bountyAnalytics.get(bountyId)) {
            case (null) { #err("Analytics not found") };
            case (?analytics) { #ok(analytics) };
        };
    };

    public shared(msg) func updateSocialLinks(
        linkedin: ?Text,
        twitter: ?Text,
        github: ?Text,
        portfolio: ?Text
    ) : async Result.Result<UserProfile, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                let updatedUser = {
                    principal = user.principal;
                    username = user.username;
                    email = user.email;
                    bio = user.bio;
                    skills = user.skills;
                    experience = user.experience;
                    education = user.education;
                    createdAt = user.createdAt;
                    updatedAt = Int.abs(Time.now());
                    role = user.role;
                    verified = user.verified;
                    verificationType = user.verificationType;
                    verificationRequestId = user.verificationRequestId;
                    preferences = user.preferences;
                    completedJobs = user.completedJobs;
                    completedBounties = user.completedBounties;
                    totalEarnings = user.totalEarnings;
                    reputation = user.reputation;
                    proofOfWork = user.proofOfWork;
                    socialLinks = ?{
                        linkedin = linkedin;
                        twitter = twitter;
                        github = github;
                        portfolio = portfolio;
                    };
                };
                
                users.put(principal, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    public shared(msg) func addProofOfWork(
        title: Text,
        description: Text,
        url: ?Text,
        powType: Text
    ) : async Result.Result<UserProfile, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                let newProofOfWork = {
                    id = Text.concat(Principal.toText(principal), Nat.toText(Int.abs(Time.now())));
                    title = title;
                    description = description;
                    url = url;
                    date = Int.abs(Time.now());
                    powType = powType;
                };

                let updatedUser = {
                    principal = user.principal;
                    username = user.username;
                    email = user.email;
                    bio = user.bio;
                    skills = user.skills;
                    experience = user.experience;
                    education = user.education;
                    createdAt = user.createdAt;
                    updatedAt = Int.abs(Time.now());
                    role = user.role;
                    verified = user.verified;
                    verificationType = user.verificationType;
                    verificationRequestId = user.verificationRequestId;
                    preferences = user.preferences;
                    completedJobs = user.completedJobs;
                    completedBounties = user.completedBounties;
                    totalEarnings = user.totalEarnings;
                    reputation = user.reputation;
                    proofOfWork = Array.append(user.proofOfWork, [newProofOfWork]);
                    socialLinks = user.socialLinks;
                };
                
                users.put(principal, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    public shared(msg) func removeProofOfWork(id: Text) : async Result.Result<UserProfile, Text> {
        let principal = msg.caller;
        
        switch (users.get(principal)) {
            case (null) { #err("User not found") };
            case (?user) {
                let updatedProofOfWork = Array.filter<Types.ProofOfWork>(
                    user.proofOfWork,
                    func(pow) { pow.id != id }
                );

                let updatedUser = {
                    principal = user.principal;
                    username = user.username;
                    email = user.email;
                    bio = user.bio;
                    skills = user.skills;
                    experience = user.experience;
                    education = user.education;
                    createdAt = user.createdAt;
                    updatedAt = Int.abs(Time.now());
                    role = user.role;
                    verified = user.verified;
                    verificationType = user.verificationType;
                    verificationRequestId = user.verificationRequestId;
                    preferences = user.preferences;
                    completedJobs = user.completedJobs;
                    completedBounties = user.completedBounties;
                    totalEarnings = user.totalEarnings;
                    reputation = user.reputation;
                    proofOfWork = updatedProofOfWork;
                    socialLinks = user.socialLinks;
                };
                
                users.put(principal, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Get all users for the leaderboard
    public query func getAllUsers() : async Result.Result<[UserProfile], Text> {
        let userList = Buffer.Buffer<UserProfile>(0);
        for ((_, user) in users.entries()) {
            userList.add(user);
        };
        #ok(Buffer.toArray(userList))
    };

    // Verification Request Management
    public shared(msg) func submitVerificationRequest(
        organizationName: Text,
        organizationType: Text,
        description: Text,
        website: ?Text,
        documents: [Text]
    ) : async Result.Result<VerificationRequest, Text> {
        let principal = msg.caller;
        
        // Check if user exists
        let userOpt = users.get(principal);
        switch (userOpt) {
            case null {
                return #err("User not found");
            };
            case (?user) {
                // Check if user already has a pending verification request
                let existingRequests = Iter.toArray(verificationRequests.vals());
                let pendingRequest = Array.find<VerificationRequest>(
                    existingRequests,
                    func(req) { req.userId == principal and req.status == "pending" }
                );
                
                switch (pendingRequest) {
                    case (?req) {
                        return #err("You already have a pending verification request");
                    };
                    case null {
                        // Create new verification request
                        let requestId = generateId();
                        let now = Int.abs(Time.now());
                        
                        let newRequest = {
                            id = requestId;
                            userId = principal;
                            organizationName = organizationName;
                            organizationType = organizationType;
                            description = description;
                            website = website;
                            documents = documents;
                            status = "pending";
                            submittedAt = now;
                            processedAt = null;
                            processedBy = null;
                            notes = null;
                        };
                        
                        verificationRequests.put(requestId, newRequest);
                        
                        // Update user profile with verification request ID
                        let updatedUser = {
                            principal = user.principal;
                            username = user.username;
                            email = user.email;
                            bio = user.bio;
                            skills = user.skills;
                            experience = user.experience;
                            education = user.education;
                            createdAt = user.createdAt;
                            updatedAt = now;
                            role = user.role;
                            verified = user.verified;
                            verificationType = user.verificationType;
                            verificationRequestId = ?requestId;
                            preferences = user.preferences;
                            socialLinks = user.socialLinks;
                            proofOfWork = user.proofOfWork;
                            totalEarnings = user.totalEarnings;
                            completedJobs = user.completedJobs;
                            completedBounties = user.completedBounties;
                            reputation = user.reputation;
                        };
                        
                        users.put(principal, updatedUser);
                        
                        // Create notification for admin
                        let notificationId = generateId();
                        let notification = {
                            id = notificationId;
                            userId = principal; // This will be updated by admin
                            title = "New Verification Request";
                            message = "A new verification request has been submitted by " # user.username;
                            notificationType = "verification_request";
                            read = false;
                            createdAt = now;
                            data = requestId;
                        };
                        
                        notifications.put(notificationId, notification);
                        
                        return #ok(newRequest);
                    };
                };
            };
        };
    };
    
    public shared(msg) func processVerificationRequest(
        requestId: Text,
        status: Text,
        notes: ?Text
    ) : async Result.Result<VerificationRequest, Text> {
        let principal = msg.caller;
        
        // Check if request exists
        let requestOpt = verificationRequests.get(requestId);
        switch (requestOpt) {
            case null {
                return #err("Verification request not found");
            };
            case (?request) {
                // Check if request is already processed
                if (request.status != "pending") {
                    return #err("Verification request has already been processed");
                };
                
                // Update request
                let now = Int.abs(Time.now());
                let updatedRequest = {
                    id = request.id;
                    userId = request.userId;
                    organizationName = request.organizationName;
                    organizationType = request.organizationType;
                    description = request.description;
                    website = request.website;
                    documents = request.documents;
                    status = status;
                    submittedAt = request.submittedAt;
                    processedAt = ?now;
                    processedBy = ?principal;
                    notes = notes;
                };
                
                verificationRequests.put(requestId, updatedRequest);
                
                // Update user profile if approved
                if (status == "approved") {
                    let userOpt = users.get(request.userId);
                    switch (userOpt) {
                        case null {
                            // User not found, should not happen
                        };
                        case (?user) {
                            let updatedUser = {
                                principal = user.principal;
                                username = user.username;
                                email = user.email;
                                bio = user.bio;
                                skills = user.skills;
                                experience = user.experience;
                                education = user.education;
                                createdAt = user.createdAt;
                                updatedAt = now;
                                role = user.role;
                                verified = true;
                                verificationType = ?request.organizationType;
                                verificationRequestId = ?requestId;
                                preferences = user.preferences;
                                socialLinks = user.socialLinks;
                                proofOfWork = user.proofOfWork;
                                totalEarnings = user.totalEarnings;
                                completedJobs = user.completedJobs;
                                completedBounties = user.completedBounties;
                                reputation = user.reputation;
                            };
                            
                            users.put(request.userId, updatedUser);
                            
                            // Create notification for user
                            let notificationId = generateId();
                            let notification = {
                                id = notificationId;
                                userId = request.userId;
                                title = "Verification Request Approved";
                                message = "Your verification request has been approved. Your account is now verified.";
                                notificationType = "verification_approved";
                                read = false;
                                createdAt = now;
                                data = "";
                            };
                            
                            notifications.put(notificationId, notification);
                        };
                    };
                } else if (status == "rejected") {
                    // Create notification for user
                    let notificationId = generateId();
                    let notification = {
                        id = notificationId;
                        userId = request.userId;
                        title = "Verification Request Rejected";
                        message = "Your verification request has been rejected. " # Option.get(notes, "");
                        notificationType = "verification_rejected";
                        read = false;
                        createdAt = now;
                        data = "";
                    };
                    
                    notifications.put(notificationId, notification);
                };
                
                return #ok(updatedRequest);
            };
        };
    };
    
    public query func getVerificationRequests(
        status: ?Text,
        limit: Nat,
        offset: Nat
    ) : async [VerificationRequest] {
        let allRequests = Iter.toArray(verificationRequests.vals());
        
        // Filter by status if provided
        let filteredRequests = switch (status) {
            case null { allRequests };
            case (?s) {
                Array.filter<VerificationRequest>(
                    allRequests,
                    func(req) { req.status == s }
                );
            };
        };
        
        // Sort by submission date (newest first)
        let sortedRequests = Array.sort<VerificationRequest>(
            filteredRequests,
            func(a, b) { Int.compare(b.submittedAt, a.submittedAt) }
        );
        
        // Apply pagination
        let start = if (offset >= sortedRequests.size()) { 0 } else { offset };
        let end = if (start + limit > sortedRequests.size()) { sortedRequests.size() } else { start + limit };
        
        let paginatedRequests = Array.tabulate<VerificationRequest>(
            end - start,
            func(i) { sortedRequests[start + i] }
        );
        
        return paginatedRequests;
    };
    
    public query func getUserVerificationRequest(
        userId: Principal
    ) : async ?VerificationRequest {
        let allRequests = Iter.toArray(verificationRequests.vals());
        
        let userRequest = Array.find<VerificationRequest>(
            allRequests,
            func(req) { req.userId == userId }
        );
        
        return userRequest;
    };
    
    // Helper function to generate unique IDs
    private func generateId() : Text {
        let timestamp = Int.toText(Int.abs(Time.now()));
        let random = Int.toText(Int.abs(Time.now() % 1000));
        return timestamp # "-" # random;
    };
}
