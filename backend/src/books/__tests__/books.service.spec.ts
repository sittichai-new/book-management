import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../books.service';
import { PrismaService } from '../../prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let prismaService: PrismaService;

  const mockBook = {
    id: 1,
    isbn: '978-3-16-148410-0',
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    publishedDate: new Date('2023-01-01'),
    pages: 300,
    coverImageUrl: 'https://example.com/cover.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPrismaService = {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createDto = {
        isbn: '978-3-16-148410-0',
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test Description',
        publishedDate: '2023-01-01',
        pages: 300,
        coverImageUrl: 'https://example.com/cover.jpg',
      };

      jest.spyOn(prismaService.book, 'create').mockResolvedValue(mockBook);

      const result = await service.create(createDto);

      expect(result).toEqual(mockBook);
      expect(prismaService.book.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createDto,
          publishedDate: expect.any(Date),
        }),
      });
    });

    it('should throw ConflictException when ISBN already exists', async () => {
      const createDto = {
        isbn: '978-3-16-148410-0',
        title: 'Test Book',
        author: 'Test Author',
      };

      jest.spyOn(prismaService.book, 'create').mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated books', async () => {
      const mockBooks = [mockBook];

      jest.spyOn(prismaService.book, 'findMany').mockResolvedValue(mockBooks);
      jest.spyOn(prismaService.book, 'count').mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(mockBooks);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        pages: 1,
      });
    });

    it('should filter by author', async () => {
      const mockBooks = [mockBook];

      jest.spyOn(prismaService.book, 'findMany').mockResolvedValue(mockBooks);
      jest.spyOn(prismaService.book, 'count').mockResolvedValue(1);

      await service.findAll(1, 10, 'Test Author');

      expect(prismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            author: expect.any(Object),
          }),
        }),
      );
    });

    it('should filter by title', async () => {
      const mockBooks = [mockBook];

      jest.spyOn(prismaService.book, 'findMany').mockResolvedValue(mockBooks);
      jest.spyOn(prismaService.book, 'count').mockResolvedValue(1);

      await service.findAll(1, 10, undefined, 'Test Book');

      expect(prismaService.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: expect.any(Object),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(mockBook);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBook);
      expect(prismaService.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when book not found', async () => {
      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when book is soft deleted', async () => {
      const deletedBook = { ...mockBook, deletedAt: new Date() };
      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(deletedBook);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      const updatedBook = { ...mockBook, ...updateDto };

      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(mockBook);
      jest.spyOn(prismaService.book, 'update').mockResolvedValue(updatedBook);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedBook);
      expect(prismaService.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('should throw ConflictException when ISBN already exists', async () => {
      const updateDto = {
        isbn: '978-3-16-148410-1',
      };

      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(mockBook);
      jest.spyOn(prismaService.book, 'update').mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when book not found', async () => {
      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a book', async () => {
      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(mockBook);
      jest.spyOn(prismaService.book, 'update').mockResolvedValue({
        ...mockBook,
        deletedAt: new Date(),
      });

      await service.remove(1);

      expect(prismaService.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when book not found', async () => {
      jest.spyOn(prismaService.book, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getStats', () => {
    it('should return book statistics', async () => {
      jest.spyOn(prismaService.book, 'count').mockResolvedValue(5);
      const aggregateResult: unknown = {
        _count: null,
        _avg: null,
        _sum: { pages: 1500 },
        _min: null,
        _max: null,
      };
      const groupByResult: unknown = [
        { author: 'Author 1', _count: { id: 3 } },
        { author: 'Author 2', _count: { id: 2 } },
      ];

      (prismaService.book as unknown as { aggregate: jest.Mock }).aggregate.mockResolvedValue(aggregateResult);
      (prismaService.book as unknown as { groupBy: jest.Mock }).groupBy.mockResolvedValue(groupByResult);

      const result = await service.getStats();

      expect(result).toEqual({
        totalBooks: 5,
        totalPages: 1500,
        topAuthors: [
          { author: 'Author 1', count: 3 },
          { author: 'Author 2', count: 2 },
        ],
      });
    });

    it('should handle null pages sum', async () => {
      jest.spyOn(prismaService.book, 'count').mockResolvedValue(0);
      const aggregateResult2: unknown = {
        _count: null,
        _avg: null,
        _sum: { pages: null },
        _min: null,
        _max: null,
      };
      (prismaService.book as unknown as { aggregate: jest.Mock }).aggregate.mockResolvedValue(aggregateResult2);
      jest.spyOn(prismaService.book, 'groupBy').mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.totalPages).toBe(0);
    });
  });
});
