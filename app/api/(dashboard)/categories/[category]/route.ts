import connect from '@/lib/db';
import User from '@/lib/modals/user';
import Category from '@/lib/modals/category';
import { Types } from 'mongoose';
import { NextResponse } from 'next/server';

export const PATCH = async (request: Request, context: { params: any }) => {
  try {
    const categoryId = context.params.category;
    const { searchParams } = new URL(request.url);
    const userId = <string>searchParams.get('userId');

    const body = await request.json();
    const { title } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: 'Invalid or missing userId',
        }),
        {
          status: 400,
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing categoryId' }),
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User nod found' }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'Category nod found' }),
        {
          status: 404,
        }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: 'Category is updated',
        category: updatedCategory,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse('Error in updating categories' + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  try {
    const categoryId = context.params.category;
    const { searchParams } = new URL(request.url);
    const userId = <string>searchParams.get('userId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({
          message: 'Invalid or missing userId',
        }),
        {
          status: 400,
        }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing categoryId' }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'Category not found' }),
        {
          status: 404,
        }
      );
    }
    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({ message: 'Category is deleted' }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse('Error in deleting categories' + error.message, {
      status: 500,
    });
  }
};
