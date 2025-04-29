module {

    public type SocialLinks = {
        linkedin: ?Text;
        twitter: ?Text;
        github: ?Text;
        portfolio: ?Text;
    };

    public type ProofOfWork = {
        id: Text;
        title: Text;
        description: Text;
        url: ?Text;
        date: Int;
        powType: Text; // "blog", "project", "article", etc.
    };

    public type VerificationRequest = {
        id: Text;
        userId: Principal;
        organizationName: Text;
        organizationType: Text; // "company", "nonprofit", "educational", "individual"
        description: Text;
        website: ?Text;
        documents: [Text]; // URLs or hashes of verification documents
        status: Text; // "pending", "approved", "rejected"
        submittedAt: Int;
        processedAt: ?Int;
        processedBy: ?Principal;
        notes: ?Text;
    };

    public type UserProfile = {
        principal: Principal;
        username: Text;
        email: Text;
        bio: ?Text;
        skills: [Text];
        experience: [Experience];
        education: [Education];
        createdAt: Int;
        updatedAt: Int;
        role: Text;
        verified: Bool;
        verificationType: ?Text; // "sponsor", "earner", null
        verificationRequestId: ?Text;
        preferences: JobPreferences;
        socialLinks: ?SocialLinks;
        proofOfWork: [ProofOfWork];
        totalEarnings: Float;
        completedJobs: Nat;
        completedBounties: Nat;
        reputation: Float;
    };

    public type JobPreferences = {
        preferredLocations: [Text];
        preferredJobTypes: [Text];
        preferredCategories: [Text];
        salaryExpectation: Float;
        remotePreference: Bool;
        experienceLevel: Text;
    };

    public type Experience = {
        id: Text;
        title: Text;
        company: Text;
        description: Text;
        startDate: Int;
        endDate: ?Int;
        isCurrent: Bool;
    };

    public type Education = {
        id: Text;
        institution: Text;
        degree: Text;
        field: Text;
        startDate: Int;
        endDate: ?Int;
        isCurrent: Bool;
    };

    public type JobCategory = {
        id: Text;
        name: Text;
        description: Text;
    };

    public type Job = {
        id: Text;
        title: Text;
        company: Text;
        description: Text;
        requirements: [Text];
        salary: Float;
        location: Text;
        jobType: Text;
        category: Text;
        postedBy: Principal;
        postedAt: Int;
        status: Text;
        applications: [Principal];
        tags: [Text];
        remote: Bool;
        experienceLevel: Text;
        benefits: [Text];
        views: Nat;
        applicationCount: Nat;
    };

    public type Application = {
        id: Text;
        jobId: Text;
        applicant: Principal;
        coverLetter: Text;
        status: Text;
        appliedAt: Int;
        updatedAt: Int;
        resume: ?Blob;
    };

    public type SearchFilters = {
        category: ?Text;
        location: ?Text;
        jobType: ?Text;
        remote: ?Bool;
        experienceLevel: ?Text;
        salaryMin: ?Float;
        salaryMax: ?Float;
    };

    public type Notification = {
        id: Text;
        userId: Principal;
        title: Text;
        message: Text;
        notificationType: Text;
        read: Bool;
        createdAt: Int;
        data: Text;
    };

    public type JobAnalytics = {
        jobId: Text;
        views: Nat;
        applications: Nat;
        uniqueApplicants: Nat;
        averageApplicationTime: Int;
        conversionRate: Float;
    };

    public type Bounty = {
        id: Text;
        title: Text;
        description: Text;
        reward: Float;
        currency: Text;  // e.g., "ICP", "USD"
        deadline: Int;
        status: Text;  // "open", "in-progress", "completed", "cancelled"
        category: Text;
        skills: [Text];
        postedBy: Principal;
        postedAt: Int;
        submissions: [BountySubmission];
        requirements: [Text];
        tags: [Text];
        views: Nat;
        submissionCount: Nat;
    };

    public type BountySubmission = {
        id: Text;
        bountyId: Text;
        submitter: Principal;
        description: Text;
        status: Text;  // "pending", "approved", "rejected"
        submittedAt: Int;
        updatedAt: Int;
        attachments: [Text];  // URLs or hashes of attached files
        feedback: ?Text;
    };

    public type BountyAnalytics = {
        bountyId: Text;
        views: Nat;
        submissions: Nat;
        uniqueSubmitters: Nat;
        averageSubmissionTime: Int;
        conversionRate: Float;
    };
}