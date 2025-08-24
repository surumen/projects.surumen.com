import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase/admin';
import { BlogPost } from '../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const postsRef = adminDb.collection('posts');
      const querySnapshot = await postsRef
        .where('published', '==', true)
        .orderBy('createdAt', 'desc')
        .get();
      
      const posts: BlogPost[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as BlogPost);
      });
      
      res.status(200).json(posts);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const postData = req.body;
      
      // Add timestamps
      const now = new Date();
      const newPost = {
        ...postData,
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await adminDb.collection('posts').add(newPost);
      
      res.status(201).json({ 
        id: docRef.id, 
        ...newPost,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
