import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase/config';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import type { Project } from '../../../app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
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
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const projectData = {
        ...req.body,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const projectsRef = collection(db, 'projects');
      const docRef = await addDoc(projectsRef, projectData);
      
      const newProject = {
        id: docRef.id,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      res.status(201).json(newProject);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create project' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}