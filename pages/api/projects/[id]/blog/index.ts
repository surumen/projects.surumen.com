import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../lib/firebase/config';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { BlogPost } from '../../../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: projectId } = req.query;
  
  if (typeof projectId !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (req.method === 'GET') {
    try {
      const blogRef = collection(db, 'projects', projectId, 'blog');
      const q = query(blogRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
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
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const blogRef = collection(db, 'projects', projectId, 'blog');
      const docRef = await addDoc(blogRef, postData);
      
      const newPost = {
        id: docRef.id,
        projectId,
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
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