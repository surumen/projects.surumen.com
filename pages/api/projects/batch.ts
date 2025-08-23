import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase/admin';
import type { Project } from '../../../app/types';

interface BatchUpdateRequest {
  projectIds: string[];
  action: 'delete' | 'archive' | 'unarchive' | 'publish' | 'unpublish';
  updates?: Partial<Project>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { projectIds, action, updates }: BatchUpdateRequest = req.body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing project IDs' });
    }

    if (!action) {
      return res.status(400).json({ error: 'Missing action parameter' });
    }

    const batch = adminDb.batch();
    let updateData: Partial<Project> = { updatedAt: new Date() };

    // Define update data based on action
    switch (action) {
      case 'delete':
        // Handle deletion separately due to subcollection cleanup
        await handleBatchDelete(projectIds);
        return res.status(200).json({ 
          message: `Successfully deleted ${projectIds.length} projects`,
          deletedIds: projectIds 
        });

      case 'archive':
        updateData.archived = true;
        break;

      case 'unarchive':
        updateData.archived = false;
        break;

      case 'publish':
        updateData.published = true;
        break;

      case 'unpublish':
        updateData.published = false;
        break;

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Apply updates to all projects
    for (const projectId of projectIds) {
      const projectRef = adminDb.collection('projects').doc(projectId);
      batch.update(projectRef, { ...updateData, ...updates });
    }

    await batch.commit();

    res.status(200).json({
      message: `Successfully ${action}ed ${projectIds.length} projects`,
      updatedIds: projectIds,
      action
    });

  } catch (error: any) {
    console.error('Batch operation error:', error);
    res.status(500).json({ 
      error: 'Failed to perform batch operation',
      details: error.message 
    });
  }
}

// Handle batch delete with subcollection cleanup
async function handleBatchDelete(projectIds: string[]) {
  const batch = adminDb.batch();

  for (const projectId of projectIds) {
    // Delete all blog posts in subcollection first
    const blogRef = adminDb.collection('projects').doc(projectId).collection('blog');
    const blogSnapshot = await blogRef.get();
    
    blogSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the main project document
    const projectRef = adminDb.collection('projects').doc(projectId);
    batch.delete(projectRef);
  }

  await batch.commit();
}
