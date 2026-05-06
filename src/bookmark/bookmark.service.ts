import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}
 
    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        });
    }

    getBookmarkById(
        userId: number, 
        bookmarkId: number
    ) {
        return this.prisma.bookmark.findFirst({
            where: {
                userId,
                id: bookmarkId,
            }
        });
    }

    async createBookmark(
        userId: number, 
        dto: CreateBookmarkDto
    ) {
        const bookmark = 
            await this.prisma.bookmark.create({
                data: {
                    userId,
                    ...dto,
                }              
            });

        return bookmark;

    }

    async editBookmarkById(
        userId: number, 
        bookmarkId: number, 
        dto: EditBookmarkDto
    ) {
        // get the bookmark by id
        const bookmark = 
            await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId,
                }
            });

        if (!bookmark || bookmark.userId !== userId)
            // check if the bookmark exists and if it belongs to the user
            throw new ForbiddenException(
                'Access to resources denied'
            );
        

        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
                userId,
            },
            data: {
                ...dto,
            }
        });
    }

    async deleteBookmarkById(
        userId: number, 
        bookmarkId: number
    ) {
        const bookmark = // get the bookmark by id
            await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId,
                }
            });

        if (!bookmark || bookmark.userId !== userId)
            // check if the bookmark exists and if it belongs to the user
            throw new ForbiddenException(
                'Access to resources denied'
            );
        

        return this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
                userId,
            }
        });
    }
}
