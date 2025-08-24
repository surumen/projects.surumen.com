import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../../../lib/firebase/admin';
import { BlogPost } from '../../../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: projectId } = req.query;
  
  if (typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (req.method === 'GET') {
    try {
      const blogRef = adminDb.collection('projects').doc(projectId).collection('blog');
      const querySnapshot = await blogRef.orderBy('createdAt', 'desc').get();
      
      const blogPosts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        blogPosts.push({
          id: doc.id,
          projectId,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as BlogPost);
      });
      
      res.status(200).json(blogPosts);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const postData = {
        ...req.body,
        projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const blogRef = adminDb.collection('projects').doc(projectId).collection('blog');
      const docRef = await blogRef.add(postData);
      
      const newPost = {
        id: docRef.id,
        ...postData,
      };
      
      res.status(201).json(newPost);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  } 
  
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}