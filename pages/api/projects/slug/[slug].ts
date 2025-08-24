import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { Project } from '../../../../app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  if (req.method === 'GET') {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      const project: Project = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Project;
      
      res.status(200).json(project);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}