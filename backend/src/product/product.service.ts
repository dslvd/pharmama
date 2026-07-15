import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, Product } from "src/generated/prisma/client";
import { ProductCreateInput } from "src/generated/prisma/models";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProduct(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductList(filter: {
    category?: string;
    order?: Prisma.SortOrder;
  }): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        ...(filter.category && { category: filter.category }),
      },
      orderBy: { createdAt: filter.order ?? "desc" },
    });
  }

  async createProduct(data: ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data: data,
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async updateProduct(id: number, body: UpdateProductDto): Promise<Product> {
    return this.prisma.$transaction(async (tx) => {
      const pr = await tx.product.findUnique({
        where: { id },
      });

      if (!pr) {
        throw new NotFoundException(`Product ${id} not found.`);
      }

      const product = await tx.product.update({
        where: { id },
        data: {
          name: body.name,
          genericName: body.genericName,
          category: body.category,
          price: body.price,
        },
      });

      return product;
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { genericName: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    });
  }
}

export class UpdateProductDto {
  name?: string;
  genericName?: string;
  category?: string;
  price?: number;
}
