import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const data = {
        ...createBookDto,
        publishedDate: createBookDto.publishedDate ? new Date(createBookDto.publishedDate) : undefined,
      } as unknown as Prisma.BookCreateInput;

      return await this.prisma.book.create({ data });
    } catch (error: unknown) {
      type ErrWithCode = { code?: string };
      const err = error as ErrWithCode;
      if (err.code === 'P2002') {
        throw new ConflictException('ISBN must be unique');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, author?: string, title?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {
      deletedAt: null,
    };

    if (author) {
      where.author = {
        contains: author,
        mode: 'insensitive',
      };
    }

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    if (book.deletedAt) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    try {
      const publishedFromDto = (updateBookDto as Partial<CreateBookDto>).publishedDate;
      const data = {
        ...updateBookDto,
        publishedDate: publishedFromDto ? new Date(publishedFromDto) : undefined,
      } as unknown as Prisma.BookUpdateInput;

      return await this.prisma.book.update({ where: { id }, data });
    } catch (error: unknown) {
      type ErrWithCode = { code?: string };
      const err = error as ErrWithCode;
      if (err.code === 'P2002') {
        throw new ConflictException('ISBN must be unique');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats() {
    const totalBooks = await this.prisma.book.count({
      where: { deletedAt: null },
    });

    const totalPages = await this.prisma.book.aggregate({
      where: { deletedAt: null },
      _sum: { pages: true },
    });

    const booksByAuthor = await this.prisma.book.groupBy({
      by: ['author'],
      where: { deletedAt: null },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    return {
      totalBooks,
      totalPages: totalPages._sum.pages || 0,
      topAuthors: booksByAuthor.map((item) => ({
        author: item.author,
        count: item._count.id,
      })),
    };
  }
}
