import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../../lib/firebase/admin';
import { BlogPost } from '../../../../app/types/cms';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    const postsRef = adminDb.collection('posts');
    const querySnapshot = await postsRef
      .where('projectSlug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    const post: BlogPost = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
    } as BlogPost;

    res.status(200).json(post);
  } catch (error: any) {
    console.error('Error fetching post by slug:', error);
    res.status(500).json({ error: error.message });
  }
}
