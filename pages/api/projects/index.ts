import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase/admin';
import type { Project } from '../../../app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const projectsRef = adminDb.collection('projects');
      const querySnapshot = await projectsRef.orderBy('createdAt', 'desc').get();
      
      const projects: Project[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Project);
      });
      
      res.status(200).json(projects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const projectData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const projectsRef = adminDb.collection('projects');
      const docRef = await projectsRef.add(projectData);
      
      const newProject = {
        id: docRef.id,
        ...projectData,
      };
      
      res.status(201).json(newProject);
    } catch (error: any) {
      console.error('Error creating project:', error);
      res.status(500).json({ 
        error: 'Failed to create project',
        details: error.message
      });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}