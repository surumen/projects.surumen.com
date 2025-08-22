import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase/admin';
import type { Project } from '../../../app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (req.method === 'GET') {
    try {
      const projectRef = adminDb.collection('projects').doc(id);
      const projectDoc = await projectRef.get();
      
      if (!projectDoc.exists) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const data = projectDoc.data();
      const project: Project = {
        id: projectDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as Project;
      
      res.status(200).json(project);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }
  
  else if (req.method === 'PUT') {
    try {
      const projectRef = adminDb.collection('projects').doc(id);
      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };
      
      await projectRef.update(updateData);
      
      res.status(200).json({ message: 'Project updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update project' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const projectRef = adminDb.collection('projects').doc(id);
      await projectRef.delete();
      
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}