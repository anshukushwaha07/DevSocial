const { Octokit } = require("@octokit/rest");
const Project = require('../../models/project.model'); 
const { generateRepoSummary } = require('../../services/ai.service');

// @desc    Get a user's public repositories from GitHub
// @route   GET /api/projects/github
// (getGithubRepos function remains the same as before)
const getGithubRepos = async (req, res) => {
    try {
        if (!req.user || !req.user.accessToken) {
            return res.status(401).json({ message: "Not authorized or GitHub token missing" });
        }
        const octokit = new Octokit({ auth: req.user.accessToken });
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            visibility: 'public', sort: 'updated', direction: 'desc', per_page: 100,
        });
        const filteredRepos = repos.map(repo => ({
            id: repo.id, name: repo.name, full_name: repo.full_name, private: repo.private,
            html_url: repo.html_url, description: repo.description, language: repo.language,
            stargazers_count: repo.stargazers_count, forks_count: repo.forks_count, updated_at: repo.updated_at,
        }));
        res.status(200).json(filteredRepos);
    } catch (error) {
        console.error("Error fetching GitHub repos:", error.message);
        res.status(500).json({ message: "Failed to fetch repositories from GitHub" });
    }
};


// @desc    Import a repository from GitHub into devSocial
// @route   POST /api/projects/import
// @access  Private
const importGithubRepo = async (req, res) => {
    const { id, name, full_name, html_url, description, language, stargazers_count, forks_count } = req.body;
    
    try {
        // Check if the project has already been imported by this user
        const existingProject = await Project.findOne({ githubId: id.toString(), owner: req.user._id });
        if (existingProject) {
            return res.status(409).json({ message: "Project has already been imported" }); // 409 Conflict
        }

        // Create a new project document in our database
        const newProject = new Project({
            owner: req.user._id,
            githubId: id.toString(),
            name: name,
            fullName: full_name,
            htmlUrl: html_url,
            description: description,
            language: language,
            stargazersCount: stargazers_count,
            forksCount: forks_count,
        });

        await newProject.save();
        res.status(201).json(newProject); // 201 Created

    } catch (error) {
        console.error("Error importing repository:", error);
        res.status(500).json({ message: "Failed to import repository" });
    }
};

// @desc    Get all projects imported by the logged-in user
// @route   GET /api/projects
// @access  Private
const getImportedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching imported projects:", error);
        res.status(500).json({ message: "Failed to fetch imported projects" });
    }
};

// @desc    Generate an AI summary for an imported project
// @route   POST /api/projects/:id/summarize
// @access  Private
const generateAISummary = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        // Security Check: Ensure project exists and belongs to the logged-in user
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "User not authorized to access this project" }); // 403 Forbidden
        }

        // Call the AI service to generate the summary
        const summary = await generateRepoSummary(project.fullName, req.user.accessToken);

        // Save the summary to the project and update the database
        project.aiSummary = summary;
        await project.save();
        
        res.status(200).json(project);

    } catch (error) {
        console.error("Error in generateAISummary controller:", error);
        res.status(500).json({ message: "Failed to generate summary" });
    }
};


module.exports = {
    getGithubRepos,
    importGithubRepo,      
    getImportedProjects,
    generateAISummary, 
};