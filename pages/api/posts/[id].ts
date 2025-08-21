import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase/admin';
import { BlogPost } from '../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  try {
    const docRef = adminDb.collection('posts').doc(id);

    if (req.method === 'GET') {
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const data = doc.data();
      const post: BlogPost = {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as BlogPost;

      res.status(200).json(post);
    } else if (req.method === 'PUT') {
      const updates = {
        ...req.body,
        updatedAt: new Date(),
      };

      await docRef.update(updates);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();
      
      const post: BlogPost = {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as BlogPost;

      res.status(200).json(post);
    } else if (req.method === 'DELETE') {
      await docRef.delete();
      res.status(204).end();
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    console.error(`Error ${req.method} post:`, error);
    res.status(500).json({ error: error.message });
  }
}
