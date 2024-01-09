import { SelectUserDto } from "src/db/dto/select-user.dto";
import { User } from "src/db/schemas/user.schema";

export const mockUser: User & { _id: string } & { toJSON: Function } = {
    username: 'leroyjenkins',
    password: 'lj123',
    email: 'lj@lj.com',
    isAdmin: false,
    name: 'Leeeeroy Jenkins',
    age: 24,
    _id: '659c83c57198563257d12dfa',
    toJSON: () => {
        return {
            username: 'leroyjenkins',
            password: 'lj123',
            email: 'lj@lj.com',
            isAdmin: false,
            name: 'Leeeeroy Jenkins',
            age: 24,
            _id: '659c83c57198563257d12dfa'
        }
    }
}

export const mockResultUser: SelectUserDto = {
    username: 'leroyjenkins',
    email: 'lj@lj.com',
    age: 24,
    _id: '659c83c57198563257d12dfa'
}

export const mockEmptyUser = null