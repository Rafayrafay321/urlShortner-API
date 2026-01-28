// node Imports
import { Types } from 'mongoose';
// Types
import { AppError } from '@/lib/appError';
import { Url } from '@/models/url';
import { Request, Response, NextFunction } from 'express';

const updateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const urlId = new Types.ObjectId(req.params.id);
    const urlDoc = await Url.findById(urlId);
    if (!urlDoc) {
      throw new AppError(404, 'Not found', 'Url not found');
    }

    if (!urlDoc.userId.equals(req.userId)) {
      throw new AppError(
        403,
        'Forbidden',
        'You are not allowed to perform operation',
      );
    }

    const originalUrl = req.body.url;
    await Url.updateOne({ _id: urlDoc._id }, { $set: { originalUrl } });
    res.status(200).json({
      code: 'Success',
      message: 'URL updated Successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default updateUrl;
