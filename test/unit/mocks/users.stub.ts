import { CreateUserDto } from "src/db/dto/create-user.dto";
import { SelectUserDto } from "src/db/dto/select-user.dto";
import { User } from "src/db/schemas/user.schema";

export const mockUser: User & { _id: string } = {
    username: 'leroyjenkins',
    password: 'lj123',
    email: 'lj@lj.com',
    isAdmin: false,
    name: 'Leeeeroy Jenkins',
    age: 24,
    _id: '659c83c57198563257d12dfa'
}

export const mockResultUser: Omit<SelectUserDto, '_id'> = {
    username: 'leroyjenkins',
    email: 'lj@lj.com',
    age: 24
}

export const mockEmptyUser = null

export const mockCreateUserData: CreateUserDto = {
    username: 'leroyjenkins',
    password: 'lj123',
    email: 'lj@lj.com',
    name: 'Leeeeroy Jenkins',
    age: 24
}