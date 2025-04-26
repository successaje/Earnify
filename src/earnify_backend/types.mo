module {

    public type UserProfile = {
        principal: Principal;
        username: Text;
        email: Text;
        bio: Text;
        skills: [Text];
        experience: [Experience];
        education: [Education];
        createdAt: Int;
        updatedAt: Int;
        role: Text;
        verified: Bool;
        preferences: JobPreferences;
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
}