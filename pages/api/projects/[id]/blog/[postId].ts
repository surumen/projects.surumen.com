import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../../../lib/firebase/admin';
import { BlogPost } from '../../../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: projectId, postId } = req.query;
  
  if (typeof projectId !== 'string' || typeof postId !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID or post ID' });
  }

  if (req.method === 'GET') {
    try {
      const postRef = adminDb.collection('projects').doc(projectId).collection('blog').doc(postId);
      const postDoc = await postRef.get();
      
      if (!postDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      const data = postDoc.data();
      const post: BlogPost = {
        id: postDoc.id,
        projectId,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as BlogPost;
      
      res.status(200).json(post);
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  }
  
  else if (req.method === 'PUT') {
    try {
      const postRef = adminDb.collection('projects').doc(projectId).collection('blog').doc(postId);
      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };
      
      await postRef.update(updateData);
      
      res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  }
  
  else if (req.method === 'DELETE') {
    try {
      const postRef = adminDb.collection('projects').doc(projectId).collection('blog').doc(postId);
      await postRef.delete();
      
      res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  }
  
  else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}