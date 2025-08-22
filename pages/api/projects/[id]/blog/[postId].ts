import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../../lib/firebase/config';
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { BlogPost } from '../../../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: projectId, postId } = req.query;
  
  if (typeof projectId !== 'string' || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID or post ID' });
  }

  if (req.method === 'GET') {
    try {
      const postRef = doc(db, 'projects', projectId, 'blog', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      const data = postSnap.data();
      const post: BlogPost = {
        id: postSnap.id,
        projectId,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as BlogPost;
      
      res.status(200).json(post);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  }
  
  else if (req.method === 'PUT') {
    try {
      const postRef = doc(db, 'projects', projectId, 'blog', postId);
      const updateData = {
        ...req.body,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(postRef, updateData);
      
      res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const postRef = doc(db, 'projects', projectId, 'blog', postId);
      await deleteDoc(postRef);
      
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}