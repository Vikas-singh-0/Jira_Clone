import { Project } from "../entities";
import { catchErrors } from "../errors";
import { issuePartial } from "../serializers/issues";
import { findEntityOrThrow, updateEntity } from "../utils/typeorm";

export const getProjectWithUsersANdIssues = catchErrors(async (req, res) => {
    const project = await findEntityOrThrow(Project, req.currentUser.projectId, {
        relations: ['users', 'issues'],
    });

    res.json({
        project: {
            ...project,
            issues: project.issues.map(issuePartial),
        }
    })
})

export const update = catchErrors(async (req, res) => {
    const project = await updateEntity(Project, req.currentUser.projectId, req.body);
    res.json({ project });
  });