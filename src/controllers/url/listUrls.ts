// Custom imports
import { Url } from '@/models/url';
// Types
import { Request, Response, NextFunction } from 'express';

const listUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const urlList = await Url.find({ userId });
    res.status(200).json({
      code: 'Success',
      urlList,
    });
  } catch (error) {
    next(error);
  }
};

export default listUrl;
