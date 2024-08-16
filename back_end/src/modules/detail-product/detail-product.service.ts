import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDetailProductDto } from './dto/create-detail-product.dto';
import { UpdateDetailProductDto } from './dto/update-detail-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailProduct } from './entities/detail-product.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class DetailProductService {
  constructor(
    @InjectRepository(DetailProduct)
    private detailProductRepository: Repository<DetailProduct>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(createDetailProductDto: CreateDetailProductDto) {
    const { product, options } = createDetailProductDto;
    await this.productsService.findProductById(product);

    options.map(async (option: any) => {
      const { price, content } = option;
      const create: DetailProduct = this.detailProductRepository.create({
        price,
        content,
      });
      await this.detailProductRepository.save(create);
    });

    return {
      success: 'true',
    };
  }

  async findDetailProductById(id: string) {
    const product = await this.detailProductRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm tương ứng');
    }

    return product;
  }

  async update(updateDetailProductDto: UpdateDetailProductDto, id: string) {
    const { quantity, price, content } = updateDetailProductDto;

    const detailProduct = await this.detailProductRepository.findOneBy({
      id: id,
    });

    if (!detailProduct) {
      throw new NotFoundException('Không tìm thấy chi tiết sản phẩm phù hợp');
    }

    if (quantity) {
      detailProduct.quantity = quantity;
    }

    if (price) {
      detailProduct.price = price;
    }

    if (content) {
      detailProduct.content = content;
    }

    await this.detailProductRepository.save(detailProduct);

    return detailProduct;
  }

  // findAll() {
  //   return `This action returns all detailProduct`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} detailProduct`;
  // }

  // update(id: number, updateDetailProductDto: UpdateDetailProductDto) {
  //   return `This action updates a #${id} detailProduct`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} detailProduct`;
  // }
}
