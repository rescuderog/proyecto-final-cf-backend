import { CreatePostDto } from "src/db/dto/create-post.dto";

export const mockCreatePostData: Omit<CreatePostDto, 'author'> = {
    title: 'Example Title',
    content: 'Lorem ipsum',
    categories: [
        'example cat 1',
        'example cat 2'
    ]
}