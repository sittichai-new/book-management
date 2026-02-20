import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../books.controller';
import { BooksService } from '../books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

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

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);

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

      jest.spyOn(service, 'create').mockResolvedValue(mockBook);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all books with default pagination', async () => {
      const mockResult = {
        data: [mockBook],
        pagination: { total: 1, page: 1, limit: 10, pages: 1 },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll();

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
    });

    it('should return books with custom pagination', async () => {
      const mockResult = {
        data: [mockBook],
        pagination: { total: 1, page: 2, limit: 5, pages: 1 },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll('2', '5');

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(2, 5, undefined, undefined);
    });

    it('should filter by author and title', async () => {
      const mockResult = {
        data: [mockBook],
        pagination: { total: 1, page: 1, limit: 10, pages: 1 },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll('1', '10', 'Test Author', 'Test Book');

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'Test Author', 'Test Book');
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBook);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateDto = { title: 'Updated Title' };
      const updatedBook = { ...mockBook, ...updateDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedBook);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getStats', () => {
    it('should return book statistics', async () => {
      const mockStats = {
        totalBooks: 5,
        totalPages: 1500,
        topAuthors: [
          { author: 'Author 1', count: 3 },
          { author: 'Author 2', count: 2 },
        ],
      };

      jest.spyOn(service, 'getStats').mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(service.getStats).toHaveBeenCalled();
    });
  });
});
