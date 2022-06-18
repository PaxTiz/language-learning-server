import languagesRepository, {
    CountInterface,
    SearchInterface,
} from '../repositories/languages_repository'

export default {
    async count(params: CountInterface) {
        return languagesRepository.count(params)
    },

    async index(params: SearchInterface) {
        return languagesRepository.findAll(params)
    },

    async findById(id: string) {
        return languagesRepository.findOneBy('id', id)
    },
}
